import { PythonShell } from 'python-shell';

interface AgentResponse {
  messages: any[];
  agent: any;
}

export async function processAgentMessage(messages: any[]): Promise<AgentResponse> {
  return new Promise((resolve, reject) => {
    const pyshell = new PythonShell('agent_server.py');

    pyshell.send(JSON.stringify({ messages }));

    pyshell.on('message', (response) => {
      resolve(JSON.parse(response));
    });

    pyshell.end((err) => {
      if (err) reject(err);
    });
  });
}