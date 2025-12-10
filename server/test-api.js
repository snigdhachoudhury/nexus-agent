// Test script to verify backend API endpoints
const http = require('http');

const BASE_URL = 'http://localhost:5000';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null,
          };
          resolve(response);
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test cases
async function runTests() {
  console.log('🧪 Testing Backend API Endpoints\n');
  console.log('='.repeat(50));

  try {
    // Test 1: Health Check
    console.log('\n1. Testing Health Check Endpoint');
    console.log('   GET /api/health');
    const healthRes = await makeRequest('GET', '/api/health');
    console.log(`   Status: ${healthRes.status}`);
    console.log(`   Response:`, healthRes.body);
    
    if (healthRes.status === 200 && healthRes.body.status === 'healthy') {
      console.log('   ✅ PASSED');
    } else {
      console.log('   ❌ FAILED');
    }

    // Test 2: Chat Message - New Session
    console.log('\n2. Testing Chat Message (New Session)');
    console.log('   POST /api/chat/message');
    const sessionId = `test-${Date.now()}`;
    const chatData = {
      sessionId: sessionId,
      userId: 'test-user-123',
      message: 'I need a dress for a wedding party, budget around $200',
    };
    console.log('   Payload:', chatData);
    const chatRes = await makeRequest('POST', '/api/chat/message', chatData);
    console.log(`   Status: ${chatRes.status}`);
    console.log(`   Response:`, JSON.stringify(chatRes.body, null, 2));
    
    if (chatRes.status === 200 && chatRes.body.success) {
      console.log('   ✅ PASSED');
    } else {
      console.log('   ❌ FAILED');
    }

    // Test 3: Chat Message - Continue Session
    console.log('\n3. Testing Chat Message (Continue Session)');
    console.log('   POST /api/chat/message');
    const chatData2 = {
      sessionId: sessionId,
      userId: 'test-user-123',
      message: 'Something elegant and summer style',
    };
    console.log('   Payload:', chatData2);
    const chatRes2 = await makeRequest('POST', '/api/chat/message', chatData2);
    console.log(`   Status: ${chatRes2.status}`);
    console.log(`   Response:`, JSON.stringify(chatRes2.body, null, 2));
    
    if (chatRes2.status === 200 && chatRes2.body.success) {
      console.log('   ✅ PASSED');
    } else {
      console.log('   ❌ FAILED');
    }

    // Test 4: Generate QR Code
    console.log('\n4. Testing QR Code Generation');
    console.log('   POST /api/qr/generate');
    const qrData = {
      userId: 'test-user-456',
      sessionId: sessionId,
      expiresIn: 300,
    };
    console.log('   Payload:', qrData);
    const qrRes = await makeRequest('POST', '/api/qr/generate', qrData);
    console.log(`   Status: ${qrRes.status}`);
    console.log(`   Response:`, JSON.stringify(qrRes.body, null, 2));
    
    if (qrRes.status === 200 && qrRes.body.success) {
      console.log('   ✅ PASSED');
      
      // Test 5: Validate QR Code
      const qrCode = qrRes.body.data.qrCode;
      console.log('\n5. Testing QR Code Validation');
      console.log('   POST /api/qr/validate');
      const validateData = { qrCode: qrCode };
      console.log('   Payload:', validateData);
      const validateRes = await makeRequest('POST', '/api/qr/validate', validateData);
      console.log(`   Status: ${validateRes.status}`);
      console.log(`   Response:`, JSON.stringify(validateRes.body, null, 2));
      
      if (validateRes.status === 200 && validateRes.body.success) {
        console.log('   ✅ PASSED');
      } else {
        console.log('   ❌ FAILED');
      }
    } else {
      console.log('   ❌ FAILED');
      console.log('   Skipping QR validation test');
    }

    // Test 6: Invalid Request (Missing fields)
    console.log('\n6. Testing Error Handling (Missing Fields)');
    console.log('   POST /api/chat/message');
    const invalidData = { sessionId: 'test' };
    console.log('   Payload:', invalidData);
    const errorRes = await makeRequest('POST', '/api/chat/message', invalidData);
    console.log(`   Status: ${errorRes.status}`);
    console.log(`   Response:`, JSON.stringify(errorRes.body, null, 2));
    
    if (errorRes.status === 400 && !errorRes.body.success) {
      console.log('   ✅ PASSED (Error handled correctly)');
    } else {
      console.log('   ❌ FAILED');
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed!\n');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error(error);
  }
}

// Run tests
runTests();
