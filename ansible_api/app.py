from ansible_playbook_api.ansible import ansible_playbook_api

if __name__ == "__main__":
    # 監視システムを実行
    result = ansible_playbook_api("application_server","stop")
    print(result)
    result = ansible_playbook_api("database","stop")
    print(result)
    result = ansible_playbook_api("user_migration_app","stop")
    print(result)