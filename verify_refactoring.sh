#!/bin/bash
# Customer Module Refactoring - Post-Deployment Verification Script
# This script verifies that the refactoring was successful

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "Customer Module Refactoring Verification"
echo "========================================"
echo ""

# Configuration
API_BASE_URL="${API_BASE_URL:-http://localhost:8080}"
PROJECT_ID="${PROJECT_ID:-1}"
TIMEOUT=5

echo "Testing API at: $API_BASE_URL"
echo ""

# Function to check API endpoint
check_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_code=$3
    local data=$4

    echo -n "Testing $method $endpoint ... "

    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$API_BASE_URL$endpoint" --max-time $TIMEOUT 2>/dev/null || echo "000")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" \
            --max-time $TIMEOUT 2>/dev/null || echo "000")
    else
        echo -e "${RED}✗ Unknown method${NC}"
        return 1
    fi

    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" = "$expected_code" ]; then
        echo -e "${GREEN}✓ OK ($http_code)${NC}"
        echo "$body" | head -n 1
        return 0
    else
        echo -e "${RED}✗ FAILED (expected $expected_code, got $http_code)${NC}"
        if [ ! -z "$body" ]; then
            echo "Response: $body" | head -n 1
        fi
        return 1
    fi
}

# Test 1: List Customers
echo "Test 1: List Customers"
check_endpoint "GET" "/api/customers?page=0&size=5" "200" || true
echo ""

# Test 2: Create Customer (No Date Fields)
echo "Test 2: Create Customer (Without Date Fields)"
customer_data='{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "phone": "1234567890",
  "address": "123 Test St",
  "city": "Test City",
  "state": "TC",
  "budget": 2500000,
  "status": "Interested",
  "projectId": 1
}'
check_endpoint "POST" "/api/customers" "200" "$customer_data" || true
echo ""

# Test 3: Get Customer by ID
echo "Test 3: Get Customer by ID"
check_endpoint "GET" "/api/customers/1" "200" || true
echo ""

# Test 4: Get Customer with Last Call (NEW ENDPOINT)
echo "Test 4: Get Customer with Last Call (NEW ENDPOINT)"
check_endpoint "GET" "/api/customers/1/with-last-call" "200" || true
echo ""

# Test 5: Get Call History
echo "Test 5: Get Call History for Customer"
check_endpoint "GET" "/api/calls/history/1" "200" || true
echo ""

# Test 6: Get Last Call
echo "Test 6: Get Last Call for Customer"
check_endpoint "GET" "/api/calls/last/1" "200" || true
echo ""

# Test 7: Create Call Log
echo "Test 7: Create Call Log"
call_data='{
  "customerId": 1,
  "callType": "Outgoing",
  "callStatus": "Connected",
  "callNotes": "Test call from verification script",
  "createdBy": "TestUser"
}'
check_endpoint "POST" "/api/calls" "200" "$call_data" || true
echo ""

# Verification checks
echo "========================================"
echo "Manual Verification Checklist"
echo "========================================"
echo ""

echo "Frontend Checks:"
echo "[ ] Customers page loads without errors"
echo "[ ] 'Add Customer' dialog appears"
echo "[ ] NO 'Date of Inquiry' field in Add dialog"
echo "[ ] NO 'Follow Up Date' field in Add dialog"
echo "[ ] Create customer successfully"
echo "[ ] 'Edit' dialog appears"
echo "[ ] NO date fields in Edit dialog"
echo "[ ] Update customer successfully"
echo "[ ] Customer list displays (no date columns)"
echo "[ ] Call Management page accessible"
echo "[ ] Can view call history for customer"
echo "[ ] Can add new call"
echo ""

echo "Backend Checks:"
echo "[ ] No compilation errors"
echo "[ ] Application started successfully"
echo "[ ] No exceptions in application logs"
echo "[ ] All endpoints responding"
echo "[ ] Database connection working"
echo ""

echo "Database Checks:"
echo "[ ] customers table exists"
echo "[ ] call_logs table exists"
echo "[ ] Proper indexes exist on call_logs"
echo "[ ] No date_of_inquiry column in customers table"
echo "[ ] No follow_up_date column in customers table"
echo ""

echo "========================================"
echo "Verification Complete"
echo "========================================"
echo ""
echo "For detailed information, see:"
echo "  - REFACTORING_CUSTOMER_MODULE.md"
echo "  - CUSTOMER_REFACTORING_GUIDE.md"
echo ""

