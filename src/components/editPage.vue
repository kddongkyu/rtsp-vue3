<script setup lang="ts">
import { computed, onMounted, reactive, ref, type Ref } from 'vue'
import axios from 'axios'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import type { BusInfo } from '@/stores/counter'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const router = useRouter()
const busData: Ref<BusInfo[]> = ref<BusInfo[]>([])
const selectedBus = ref({ name: '', url: '' })
const busName = ref('-')
const busUrl = ref('-')

const addBusData = reactive<BusInfo>({
  name: '',
  url: ''
})
const editMode: Ref<boolean> = ref<boolean>(false)
const addMode: Ref<boolean> = ref<boolean>(false)

const getBusList = async () => {
  const res = await axios.post('/bus/data')
  busData.value = res.data.busList
}

const addBus = async () => {
  if (addBusData.name === '' || addBusData.url === '') {
    alert('노선명 또는 Url 이 입력되지않았습니다.')
    return
  }
  await axios
    .post('/bus', {
      name: addBusData.name,
      url: addBusData.url
    })
    .then(() => {
      alert('등록되었습니다.')
      addMode.value = false
      getBusList()
      addBusData.name = ''
      addBusData.url = ''
    })
}
const updateBus = async () => {
  await axios
    .put('/bus', {
      name: selectedBus.value?.name,
      url: selectedBus.value?.url
    })
    .then(() => {
      alert('수정되었습니다.')
      editMode.value = false
      getBusList()
      selectedBus.value = { name: '', url: '' }
    })
}

const deleteBus = async () => {
  if (window.confirm('정말로 삭제하시겠습니까?')) {
    await axios.delete(`/bus?name=${selectedBus.value?.name}`).then(() => {
      alert('삭제되었습니다.')
      getBusList()
      selectedBus.value = { name: '', url: '' }
    })
  }
}

onMounted(async () => {
  await getBusList()
})

watch(addBusData, (newValue) => {
  addBusData.name = newValue.name
  addBusData.url = newValue.url
})

watch(selectedBus, (newValue) => {
  busName.value = newValue.name
  busUrl.value = newValue.url
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
      return-object
    ></v-select>
    <v-table>
      <thead>
        <tr class="text-center">
          <th class="text-center">노선명</th>
          <td>
            <template v-if="addMode && addBusData">
              <v-text-field
                v-model="addBusData.name"
                label="노선명을 작성해주세요"
                hide-details="auto"
              ></v-text-field>
            </template>
            <div v-else>
              {{ busName }}
            </div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr class="text-center">
          <th class="text-center">URL</th>
          <td>
            <template v-if="addMode">
              <v-text-field
                v-model="addBusData.url"
                label="URL을 작성해주세요"
                hide-details="auto"
              ></v-text-field>
            </template>
            <template v-else-if="editMode">
              <v-text-field
                v-model="selectedBus.url"
                label="수정할 URL"
                hide-details="auto"
              ></v-text-field>
            </template>
            <template v-else>
              {{ busUrl }}
            </template>
          </td>
        </tr>
      </tbody>
    </v-table>
    <div class="button-box">
      <v-btn
        class="ma-2"
        color="black"
        @click="
          () => {
            if (addMode) {
              addBusData.name = ''
              addBusData.url = ''
              addMode = false
            } else if (editMode) {
              selectedBus.name = ''
              selectedBus.url = ''
              editMode = false
            } else {
              router.push('/streaming')
            }
          }
        "
      >
        <v-icon
          start
          :icon="addMode ? 'mdi-cancel' : editMode ? 'mdi-cancel' : 'mdi-keyboard-backspace'"
        ></v-icon>
        {{ addMode || editMode ? '취소' : '뒤로가기' }}
      </v-btn>
      <v-btn
        class="ma-2"
        color="red"
        :disabled="editMode || addMode"
        @click="
          () => {
            deleteBus()
          }
        "
      >
        <v-icon start icon="mdi-delete-forever"></v-icon>
        삭제
      </v-btn>
      <v-btn
        class="ma-2"
        :color="editMode ? 'green' : 'orange-darken-2'"
        :disabled="addMode"
        @click="
          () => {
            if (editMode) {
              updateBus()
            } else {
              editMode = true
            }
          }
        "
      >
        <v-icon start icon="mdi-pencil"></v-icon>
        {{ editMode ? '적용' : '수정' }}
      </v-btn>
      <v-btn
        class="ma-2"
        :color="addMode ? 'green' : 'blue'"
        :disabled="editMode"
        @click="
          () => {
            if (addMode) {
              addBus()
            } else {
              addMode = true
            }
          }
        "
      >
        <v-icon start icon="mdi-plus"></v-icon>
        {{ addMode ? '적용' : '추가' }}
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.box {
  width: 84vw;
  max-height: 100vh; /* 뷰포트 높이에 맞춤 */
  overflow: hidden; /* 필요 시 스크롤을 숨김 */
  display: flex;
  flex-direction: column;
  justify-content: center;
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
.button-box {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}
</style>
