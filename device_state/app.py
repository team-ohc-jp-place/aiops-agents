from device_state_api.deviceState import DeviceState

if __name__ == "__main__":
    # 全デバイスの状態取得
    device_state = DeviceState.get_instance()
    states = device_state.get_all_states()
    print(states)
