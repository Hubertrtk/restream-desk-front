<template>
  <div>
    <input type="file" @change="onFileChange" multiple />
    <button @click="uploadFiles">Wyślij pliki</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { sendTicketImages } from '@/api/serviceApi'

const files = ref([])

const onFileChange = (event) => {
  files.value = Array.from(event.target.files)
}

const uploadFiles = async () => {
  if (files.value.length === 0) return

  const formData = new FormData()
  files.value.forEach((file) => formData.append('files', file)) // 'photos' pasuje do Multer.array("photos")

  sendTicketImages(formData)
    .then((r) => {
      console.log(r)
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>
