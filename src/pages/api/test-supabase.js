// pages/api/test-supabase.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const testResults = {
    timestamp: new Date().toISOString(),
    environmentVariables: {},
    supabaseConnection: {},
    databaseTest: {},
    errors: []
  };

  try {
    // Check environment variables
    testResults.environmentVariables = {
      supabaseUrl: !!process.env.SUPABASE_URL,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
      urlValue: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 30) + '...' : 'NOT SET'
    };

    if (!process.env.SUPABASE_URL) {
      testResults.errors.push('SUPABASE_URL environment variable is missing');
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_ANON_KEY) {
      testResults.errors.push('Neither SUPABASE_SERVICE_ROLE_KEY nor SUPABASE_ANON_KEY is set');
    }

    // Test Supabase connection
    if (process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)) {
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
      const supabase = createClient(process.env.SUPABASE_URL, supabaseKey);

      testResults.supabaseConnection = {
        clientCreated: true,
        keyType: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service_role' : 'anon'
      };

      // Test basic connection with a simple query
      try {
        // Try to access the auth service (doesn't require any tables)
        const { data: authData, error: authError } = await supabase.auth.getSession();
        
        testResults.supabaseConnection.authServiceAccessible = !authError;
        if (authError) {
          testResults.errors.push(`Auth service error: ${authError.message}`);
        }

        // Test database connection by trying to query a system table
        const { data, error, status } = await supabase
          .from('information_schema')
          .select('table_name')
          .limit(1);

        testResults.databaseTest = {
          queryExecuted: true,
          status: status,
          hasError: !!error,
          errorMessage: error?.message || null,
          canAccessSystemTables: !error && Array.isArray(data)
        };

        if (error) {
          testResults.errors.push(`Database query error: ${error.message}`);
        } else {
          testResults.databaseTest.connectionSuccessful = true;
        }

        // Test if we can access any tables (optional)
        try {
          const { data: tables, error: tablesError } = await supabase
            .rpc('get_table_names'); // This might not exist, so we'll catch the error

          if (!tablesError && tables) {
            testResults.databaseTest.customTablesAccessible = true;
            testResults.databaseTest.availableTables = tables.length;
          }
        } catch (rpcError) {
          // This is expected if the RPC doesn't exist
          testResults.databaseTest.customRpcNote = 'Custom RPC functions not tested';
        }

        // Test specific tables if they exist
        const tablesToTest = ['users', 'checkout_sessions', 'subscriptions'];
        testResults.databaseTest.tableAccess = {};

        for (const tableName of tablesToTest) {
          try {
            const { data, error } = await supabase
              .from(tableName)
              .select('*')
              .limit(1);

            testResults.databaseTest.tableAccess[tableName] = {
              exists: !error || !error.message.includes('does not exist'),
              accessible: !error,
              error: error?.message || null
            };
          } catch (tableError) {
            testResults.databaseTest.tableAccess[tableName] = {
              exists: false,
              accessible: false,
              error: tableError.message
            };
          }
        }

      } catch (connectionError) {
        testResults.supabaseConnection.error = connectionError.message;
        testResults.errors.push(`Connection error: ${connectionError.message}`);
      }
    } else {
      testResults.supabaseConnection.error = 'Missing required environment variables';
      testResults.errors.push('Cannot test Supabase connection - missing environment variables');
    }

    // Overall status
    testResults.overall = {
      isConfigured: testResults.environmentVariables.supabaseUrl && 
                   (testResults.environmentVariables.supabaseServiceKey || testResults.environmentVariables.supabaseAnonKey),
      isConnected: testResults.databaseTest.connectionSuccessful || false,
      hasErrors: testResults.errors.length > 0,
      errorCount: testResults.errors.length,
      status: testResults.errors.length === 0 ? 'SUCCESS' : 'ISSUES_FOUND'
    };

    return res.status(200).json(testResults);

  } catch (error) {
    return res.status(500).json({
      error: 'Test failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// Alternative minimal test function for basic connectivity
export function testSupabaseBasic() {
  const hasUrl = !!process.env.SUPABASE_URL;
  const hasKey = !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);
  
  return {
    configured: hasUrl && hasKey,
    url: hasUrl,
    key: hasKey,
    urlPreview: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 30) + '...' : 'NOT SET'
  };
}
