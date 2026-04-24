const express = require('express');
const router = express.Router();
const Joi = require('joi');

/**
 * BFHL API - Process hierarchical data with edges
 * Builds trees from edges, detects cycles, validates inputs
 */

// Validation schema
const bfhlSchema = Joi.object({
  data: Joi.array()
    .items(Joi.string())
    .required()
    .messages({
      'array.base': 'Data must be an array',
      'any.required': 'Data field is required'
    }),
  user_id: Joi.string().required(),
  email_id: Joi.string().email().required(),
  college_roll_number: Joi.string().required()
});

/**
 * Validate edge format: X->Y where X,Y are single uppercase letters
 */
function isValidEdge(edge) {
  if (typeof edge !== 'string') return false;
  const trimmed = edge.trim();
  
  // Check empty
  if (trimmed === '') return false;
  
  // Check format X->Y
  if (!/^[A-Z]->[A-Z]$/.test(trimmed)) return false;
  
  // Check self-loop
  if (trimmed[0] === trimmed[3]) return false;
  
  return true;
}

/**
 * Parse edge "A->B" into {from, to}
 */
function parseEdge(edge) {
  const [from, to] = edge.trim().split('->');
  return { from, to };
}

/**
 * Detect cycle using DFS
 */
function hasCycle(graph, startNode, visited = new Set(), recStack = new Set()) {
  visited.add(startNode);
  recStack.add(startNode);

  const neighbors = graph[startNode] || [];
  for (const neighbor of neighbors) {
    if (!visited.has(neighbor)) {
      if (hasCycle(graph, neighbor, visited, recStack)) {
        return true;
      }
    } else if (recStack.has(neighbor)) {
      return true;
    }
  }

  recStack.delete(startNode);
  return false;
}

/**
 * Build nested tree structure
 */
function buildTree(root, graph, visited = new Set()) {
  if (visited.has(root)) return {};
  visited.add(root);

  const children = graph[root] || [];
  const tree = {};

  for (const child of children) {
    tree[child] = buildTree(child, graph, visited);
  }

  return tree;
}

/**
 * Calculate tree depth (longest path from root to leaf)
 */
function calculateDepth(tree) {
  if (!tree || Object.keys(tree).length === 0) return 1;
  
  let maxDepth = 0;
  for (const child of Object.keys(tree)) {
    maxDepth = Math.max(maxDepth, calculateDepth(tree[child]));
  }
  
  return maxDepth + 1;
}

/**
 * POST /bfhl
 * Process hierarchical data from edges
 */
router.post('/', async (req, res) => {
  try {
    // Validate input
    const { error, value } = bfhlSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        is_success: false,
        message: error.details[0].message,
        error_code: 'INVALID_INPUT'
      });
    }

    const { data, user_id, email_id, college_roll_number } = value;

    // Process edges
    const validEdges = [];
    const invalidEntries = [];
    const duplicateEdges = [];
    const seenEdges = new Set();

    // Track all nodes and their parents
    const allNodes = new Set();
    const parentOf = {}; // child -> parent mapping
    const adjacencyList = {}; // parent -> [children]

    for (const entry of data) {
      if (!isValidEdge(entry)) {
        invalidEntries.push(entry.trim());
        continue;
      }

      const edgeStr = entry.trim();
      
      // Check for duplicates
      if (seenEdges.has(edgeStr)) {
        duplicateEdges.push(edgeStr);
        continue;
      }

      seenEdges.add(edgeStr);
      validEdges.push(edgeStr);

      // Parse edge
      const { from, to } = parseEdge(edgeStr);
      allNodes.add(from);
      allNodes.add(to);

      // Handle multi-parent case: first parent wins
      if (!(to in parentOf)) {
        parentOf[to] = from;
      }

      // Build adjacency list
      if (!adjacencyList[from]) {
        adjacencyList[from] = [];
      }
      adjacencyList[from].push(to);
    }

    // Find root nodes (nodes that are never children)
    const childNodes = new Set(Object.keys(parentOf));
    const rootCandidates = Array.from(allNodes).filter(node => !childNodes.has(node));

    // Build groups from roots or cycles
    let groups = [];
    const visited = new Set();

    if (rootCandidates.length === 0 && allNodes.size > 0) {
      // All nodes appear as children - must be cycles
      for (const node of Array.from(allNodes).sort()) {
        if (!visited.has(node)) {
          // DFS to find connected cycle component
          const component = [];
          const stack = [node];
          const compVisited = new Set();

          while (stack.length > 0) {
            const current = stack.pop();
            if (compVisited.has(current)) continue;
            compVisited.add(current);
            component.push(current);

            // Add all connected nodes (both children and parents)
            if (adjacencyList[current]) {
              stack.push(...adjacencyList[current]);
            }
            if (parentOf[current]) {
              stack.push(parentOf[current]);
            }
          }

          // Mark all nodes in this component as visited
          component.forEach(n => visited.add(n));
          groups.push({ nodes: new Set(component), root: component.sort()[0] });
        }
      }
    } else {
      // Normal case: build groups from roots
      for (const root of rootCandidates) {
        const group = new Set();
        const stack = [root];
        const groupVisited = new Set();

        while (stack.length > 0) {
          const current = stack.pop();
          if (groupVisited.has(current)) continue;
          groupVisited.add(current);
          group.add(current);

          // Only traverse children
          if (adjacencyList[current]) {
            stack.push(...adjacencyList[current]);
          }
        }

        // Mark all nodes in this group as globally visited
        group.forEach(n => visited.add(n));
        groups.push({ nodes: group, root });
      }

      // Handle any remaining isolated/cycle nodes
      for (const node of Array.from(allNodes).sort()) {
        if (!visited.has(node)) {
          // Found an unvisited node - could be part of a cycle
          const component = [];
          const stack = [node];
          const compVisited = new Set();

          while (stack.length > 0) {
            const current = stack.pop();
            if (compVisited.has(current)) continue;
            compVisited.add(current);
            component.push(current);

            // Add all connected nodes (both directions)
            if (adjacencyList[current]) {
              stack.push(...adjacencyList[current]);
            }
            if (parentOf[current]) {
              stack.push(parentOf[current]);
            }
          }

          // Mark all nodes in this component as visited
          component.forEach(n => visited.add(n));
          groups.push({ nodes: new Set(component), root: component.sort()[0] });
        }
      }
    }

    // Build hierarchies
    const hierarchies = [];
    let maxDepth = 0;
    let largestRoot = null;

    for (const group of groups) {
      const root = group.root;

      // Check for cycle in this group
      const cycleCheck = new Set();
      const isCyclic = hasCycle(adjacencyList, root, new Set(), new Set());

      if (isCyclic) {
        hierarchies.push({
          root,
          tree: {},
          has_cycle: true
        });
      } else {
        // Build tree for non-cyclic group
        const rootTree = {};
        const visited = new Set();
        visited.add(root);
        
        for (const child of (adjacencyList[root] || [])) {
          rootTree[child] = buildTree(child, adjacencyList, visited);
        }

        const fullTree = { [root]: rootTree };
        // Calculate depth from rootTree (children), then add 1 for root
        const childrenDepth = rootTree && Object.keys(rootTree).length > 0 
          ? Math.max(...Object.values(rootTree).map(t => calculateDepth(t)))
          : 0;
        const depth = childrenDepth + 1;

        hierarchies.push({
          root,
          tree: fullTree,
          depth
        });

        // Track largest tree
        if (depth > maxDepth || (depth === maxDepth && (!largestRoot || root < largestRoot))) {
          maxDepth = depth;
          largestRoot = root;
        }
      }
    }

    // Build summary
    const summary = {
      total_trees: hierarchies.filter(h => !h.has_cycle).length,
      total_cycles: hierarchies.filter(h => h.has_cycle).length,
      largest_tree_root: largestRoot
    };

    res.status(200).json({
      is_success: true,
      user_id,
      email_id,
      college_roll_number,
      hierarchies,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary
    });

  } catch (error) {
    console.error('BFHL Error:', error);
    res.status(500).json({
      is_success: false,
      message: 'Internal server error',
      error_code: 'SERVER_ERROR',
      error: error.message
    });
  }
});

/**
 * GET /bfhl/info
 * Get information about the BFHL endpoint
 */
router.get('/info', (req, res) => {
  res.status(200).json({
    is_success: true,
    endpoint: '/bfhl',
    method: 'POST',
    description: 'Process hierarchical data from edges',
    request_format: {
      user_id: 'string (format: fullname_ddmmyyyy)',
      email_id: 'string (email)',
      college_roll_number: 'string',
      data: ['array of edges in format A->B']
    },
    example_input: {
      user_id: 'johndoe_17091999',
      email_id: 'john.doe@college.edu',
      college_roll_number: '21CS1001',
      data: ['A->B', 'A->C', 'B->D', 'X->Y', 'Y->Z', 'Z->X', 'hello', '1->2']
    },
    processing_rules: {
      'Valid format': 'Single uppercase letters X->Y (no self-loops)',
      'Invalid entries': 'Non-matching formats, numbers, multi-char, self-loops, empty',
      'Duplicate edges': 'First occurrence used, rest tracked',
      'Tree construction': 'Root = node never appearing as child',
      'Cycle detection': 'Detected via DFS, tree empty for cyclic groups',
      'Depth': 'Longest path from root to leaf (node count)'
    }
  });
});

module.exports = router;
