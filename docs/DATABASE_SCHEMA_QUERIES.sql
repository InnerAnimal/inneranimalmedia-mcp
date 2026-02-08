-- Database Schema Information Queries
-- D1 Database: inneranimalmedia-business
-- These PRAGMA commands retrieve schema information for AI and agent-related tables

-- AI Models table
PRAGMA table_info('ai_models');

-- Agent Telemetry table  
PRAGMA table_info('agent_telemetry');

-- Agents table
PRAGMA table_info('agents');

-- Agent AI SAM table
PRAGMA table_info('agent_ai_sam');

-- Agent AI Executable Limits table
PRAGMA table_info('agent_ai_executable_limits');

-- Additional useful queries to understand the schema

-- List all tables in the database
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;

-- Get indexes for each table
SELECT name, sql FROM sqlite_master WHERE type='index' ORDER BY name;

-- View full CREATE TABLE statements
SELECT sql FROM sqlite_master WHERE type='table' AND name IN (
  'ai_models',
  'agent_telemetry', 
  'agents',
  'agent_ai_sam',
  'agent_ai_executable_limits'
);
