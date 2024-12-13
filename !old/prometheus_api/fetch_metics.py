import requests
import os

# 環境変数からPROMETHEUS_SERVERとTOKENを取得
# export TOKEN=$(oc whoami -t)
# export HOST=$(oc -n openshift-monitoring get route prometheus-k8s -ojsonpath={.status.ingress[].host})
PROMETHEUS_SERVER = "http://" + os.getenv("HOST", "default-server.com")
TOKEN = os.getenv("TOKEN", "default-token")

# cpu
QUERY = 'sum(rate(container_cpu_usage_seconds_total{namespace="petstore", pod=~".*", container != "POD", container != ""}[1m])) by (container)'
# memory
#QUERY = 'sum(container_memory_usage_bytes{namespace="petstore", pod=~".*", container != "POD", container != ""}) by (container)'
# network
#QUERY = 'sum(rate(container_network_receive_bytes_total{namespace="petstore", container="POD", name=~"k8s_POD_.*"}[1m]))'

headers = {
    "Authorization": f"Bearer {TOKEN}"
}

response = requests.get(
    f"{PROMETHEUS_SERVER}/api/v1/query",
    params={"query": QUERY},
    headers=headers
)

if response.status_code == 200:
    data = response.json()
    print("Prometheus Data:", data)
else:
    print("Error:", response.status_code, response.text)

