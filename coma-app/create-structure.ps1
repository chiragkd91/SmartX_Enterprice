# PowerShell script to create the complete coma-app directory structure

Write-Host "Creating coma-app project structure..." -ForegroundColor Green

# Root level directories
$directories = @(
    "ai/agents",
    "ai/context_builder", 
    "ai/prompt_templates",
    "ai/llm_clients",
    "ai/model_management",
    "ai/training",
    
    "editor/vscode_core",
    "editor/custom_ui/components",
    "editor/custom_ui/themes", 
    "editor/custom_ui/icons",
    "editor/custom_ui/layouts",
    "editor/workspace_parser",
    "editor/accessibility",
    
    "file_indexer/embeddings",
    "file_indexer/indexing", 
    "file_indexer/search",
    
    "api/ai_requests",
    "api/backend_sync",
    "api/auth",
    "api/websocket",
    
    "config/settings",
    "config/schemas",
    "config/migrations/versions",
    
    "chat/threads",
    "chat/actions",
    "chat/voice", 
    "chat/history",
    
    "security/encryption",
    "security/privacy_manager",
    "security/audit_logs",
    "security/permissions",
    
    "performance/telemetry",
    "performance/profiler",
    "performance/cache_manager",
    "performance/resource_optimizer",
    
    "extensions/marketplace",
    "extensions/plugin_api",
    "extensions/themes",
    "extensions/ai_models",
    
    "collaboration/real_time_sync",
    "collaboration/code_sharing",
    "collaboration/pair_programming",
    "collaboration/review_system",
    
    "dev_tools/debugger",
    "dev_tools/terminal",
    "dev_tools/task_runner",
    "dev_tools/testing_framework",
    
    "version_control/git_ai_assistant",
    "version_control/branch_intelligence",
    "version_control/merge_assistant",
    "version_control/history_analysis",
    
    "language_support/lsp_integration",
    "language_support/syntax_highlighting",
    "language_support/auto_completion",
    "language_support/error_detection",
    
    "code_intelligence/quality_metrics",
    "code_intelligence/dependency_analyzer",
    "code_intelligence/refactoring_engine",
    "code_intelligence/documentation_gen",
    "code_intelligence/pattern_recognition",
    
    "cloud_sync/project_backup",
    "cloud_sync/settings_sync",
    "cloud_sync/collaboration_server",
    "cloud_sync/mobile_companion",
    
    "marketplace/model_hub",
    "marketplace/template_store",
    "marketplace/snippet_library",
    "marketplace/integration_store",
    
    "deployment/docker_integration",
    "deployment/cloud_deploy",
    "deployment/ci_cd_assistant",
    "deployment/environment_manager",
    
    "ux_features/onboarding",
    "ux_features/command_palette_ai",
    "ux_features/voice_coding",
    "ux_features/accessibility",
    "ux_features/personalization",
    
    "search/global_search",
    "search/documentation_search",
    "search/code_examples",
    "search/learning_resources",
    
    "optimization/lazy_loading",
    "optimization/incremental_indexing",
    "optimization/ai_model_caching",
    "optimization/bandwidth_optimizer",
    
    "test/unit",
    "test/integration",
    "test/e2e",
    "test/performance",
    "test/security",
    "test/ai_model_tests",
    
    "docs/user_guide",
    "docs/developer_guide",
    "docs/api_docs",
    "docs/tutorials",
    
    "tools/build",
    "tools/dev_server",
    "tools/code_generators",
    "tools/quality_tools",
    
    "database/migrations",
    "database/models",
    "database/repositories",
    "database/storage",
    
    "localization/translations",
    "localization/i18n",
    "localization/tools",
    
    "analytics/user_analytics",
    "analytics/performance_analytics",
    "analytics/ai_analytics",
    "analytics/business_analytics",
    
    "compliance/data_protection",
    "compliance/security_compliance",
    "compliance/accessibility_compliance",
    
    "deployment_configs/docker",
    "deployment_configs/kubernetes",
    "deployment_configs/cloud/aws",
    "deployment_configs/cloud/gcp",
    "deployment_configs/cloud/azure",
    "deployment_configs/ci_cd/github",
    "deployment_configs/ci_cd/gitlab",
    "deployment_configs/ci_cd/jenkins"
)

# Create all directories
foreach ($dir in $directories) {
    $fullPath = Join-Path $PWD $dir
    New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
    Write-Host "Created: $dir" -ForegroundColor Yellow
}

Write-Host "`nDirectory structure created successfully!" -ForegroundColor Green
Write-Host "Total directories created: $($directories.Count)" -ForegroundColor Cyan