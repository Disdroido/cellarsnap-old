<template>
  <div>
    <input type="file" @change="handleFileUpload" accept="image/*">
    <button @click="scanImage">Scan Image</button>
  </div>
</template>

<script>
import Tesseract from 'tesseract.js';

export default {
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = e.target.result;
        this.scanImage(image);
      };
      reader.readAsDataURL(file);
    },
    async scanImage(image) {
      const { data: { text } } = await Tesseract.recognize(image);
      console.log(text);
      // Handle the scanned text here
    }
  }
}
</script>

