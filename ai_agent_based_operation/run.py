from repl import run_demo_loop
from operation_agents import ca_agent,device_control
#from external_api import fault_injection

if __name__ == "__main__":

    #device_control("application_server", "start")
    #device_control("database", "start")
    #device_control("user_migration_app", "start")
    #fault_injection()

    run_demo_loop(ca_agent, stream=True)