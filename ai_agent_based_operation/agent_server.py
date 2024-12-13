import json
import sys
from operation_agents import ca_agent
from swarm import Swarm

def process_message():
    # 標準入力からメッセージを読み取り
    input_data = sys.stdin.readline()
    data = json.loads(input_data)

    client = Swarm()
    response = client.run(
        agent=ca_agent,
        messages=data['messages'],
        stream=False
    )

    # 結果を標準出力に書き込み
    print(json.dumps({
        'messages': response.messages,
        'agent': response.agent.name
    }))

if __name__ == "__main__":
    process_message()