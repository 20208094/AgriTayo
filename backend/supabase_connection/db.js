const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ujkduozvtzkaiqqtztuy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqa2R1b3p2dHprYWlxcXR6dHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA5NzYxODYsImV4cCI6MjAzNjU1MjE4Nn0.deJX-nYVGh9qi5gyJG6A4WW26h3oxaWKTSU1DqFkC-c';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
