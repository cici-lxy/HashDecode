#!/bin/bash

echo "🧪 Testing Blockscribe Security API..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "${YELLOW}Test 1: Health Check${NC}"
curl -s http://localhost:3001/api/health | jq '.'
echo ""

# Test 2: Uniswap Swap (Medium Risk)
echo "${YELLOW}Test 2: Uniswap Token Swap (Medium Risk)${NC}"
curl -s -X POST http://localhost:3001/api/analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "to": "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
    "data": "0x38ed1739000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "value": "0x0"
  }' | jq '.data.decoded, .data.risk'
echo ""

# Test 3: Token Approval (High Risk)
echo "${YELLOW}Test 3: Token Approval (High Risk)${NC}"
curl -s -X POST http://localhost:3001/api/analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
    "data": "0x095ea7b3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffff",
    "value": "0x0"
  }' | jq '.data.decoded, .data.risk'
echo ""

# Test 4: Unknown Function (Critical Risk)
echo "${YELLOW}Test 4: Unknown Function (Critical Risk)${NC}"
curl -s -X POST http://localhost:3001/api/analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "to": "0x0000000000000000000000000000000000000000",
    "data": "0xdeadbeef000000000000000000000000000000000000000000000000000000000000000",
    "value": "0xde0b6b3a7640000"
  }' | jq '.data.decoded, .data.risk'
echo ""

# Test 5: Contract Info
echo "${YELLOW}Test 5: Get Contract Info${NC}"
curl -s http://localhost:3001/api/analysis/contract/0x7a250d5630b4cf539739df2c5dacb4c659f2488d | jq '.'
echo ""

echo "${GREEN}✅ All tests complete!${NC}"

