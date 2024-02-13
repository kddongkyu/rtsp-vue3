<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import axios from 'axios'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import JSMpeg from '@cycjimmy/jsmpeg-player'
import type { BusInfo } from '@/stores/counter'
import { useRouter } from 'vue-router'

const router = useRouter()
const busData: Ref<BusInfo[]> = ref<BusInfo[]>([])
const selectedBus = ref<string | null>(null)
const companyName = ref('')
const memberId = ref('')
const statusBox = ref<string>('none')
const statusText = ref<string>('Ready To Use')
const statusMarkColor = ref<string>('blue')

const videoContainer = ref(null)
let player: JSMpeg.Player | null = null

const getBusList = async () => {
  const res = await axios.post('/bus/data')
  busData.value = res.data.busList
  memberId.value = res.data.memberId
  companyName.value = res.data.companyName
}
const logout = async () => {
  await axios.get('/member/logout')
}

const connectWebSocket = async () => {
  statusBox.value = 'flex'
  try {
    await axios.post('/video', {
      busRoute: selectedBus.value
    })

    const websocketUrl = `ws://tongtong.tplinkdns.com:${Number(memberId.value) + 60000}`
    player = new JSMpeg.Player(websocketUrl, { canvas: videoContainer.value })

    statusText.value = 'Connecting'
    statusMarkColor.value = 'yellow'

    checkDataReception()
  } catch (error) {
    console.error('Error in connectWebSocket:', error)
  }
}

const checkDataReception = () => {
  const checkInterval = setInterval(() => {
    if (player && player.video && player.video.currentTime > 0) {
      statusText.value = 'Connected'
      statusMarkColor.value = 'green'
      clearInterval(checkInterval)
    }
  }, 1000) // 1초마다 확인
}

watch(selectedBus, () => {
  statusText.value = 'Disconnect'
  statusMarkColor.value = 'red'
  setTimeout(() => {
    connectWebSocket()
  }, 1000)
  console.log(selectedBus)
})

onMounted(async () => {
  await getBusList()
})
</script>

<template>
  <div class="box">
    <div class="header">Mobile CCTV</div>
    <v-select
      label="노선을 선택해주세요"
      v-model="selectedBus"
      :items="busData"
      item-title="name"
      variant="solo"
    ></v-select>
    <div class="status-box">
      <div class="status-mark"></div>
      <div class="status-text">{{ statusText }}</div>
    </div>
    <canvas class="video" ref="videoContainer"></canvas>
    <div class="button-box">
      <v-btn
        class="ma-2"
        color="red"
        @click="
          async () => {
            await logout()
            router.push('/')
          }
        "
      >
        <v-icon start icon="mdi-logout"></v-icon>
        로그아웃
      </v-btn>
      <v-btn
        class="ma-2"
        color="orange-darken-2"
        @click="
          () => {
            router.push('/edit')
          }
        "
      >
        <v-icon start icon="mdi-cog"></v-icon>
        노선 관리
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.box {
  max-height: 100vh; /* 뷰포트 높이에 맞춤 */
  overflow: hidden; /* 필요 시 스크롤을 숨김 */
  display: flex;
  flex-direction: column;
}
.video {
  border: 3px solid black;
  border-radius: 10px;
  width: 84vw;
}
.header {
  text-align: center;
  font-weight: bold;
  background-color: lightgray;
  margin-bottom: 30px;
  border-radius: 10px;
  font-size: 100px;
}

/* Medium screens (e.g., tablets) */
@media (max-width: 768px) {
  .header {
    font-size: 70px;
  }
}

/* Small screens (e.g., mobile phones) */
@media (max-width: 480px) {
  .header {
    font-size: 50px;
  }
}

.status-box {
  display: v-bind(statusBox);
  margin-bottom: 8px;
  margin-top: -5px;
  justify-content: center;
  background-color: black;
  border-radius: 5px;
  height: 40px;
  align-items: center;
}

.status-mark {
  border-radius: 100px;
  width: 20px;
  height: 20px;
  background-color: v-bind(statusMarkColor);
}

.status-text {
  font-family: NotoSans;
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
  color: v-bind(statusMarkColor);
}

.button-box {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
