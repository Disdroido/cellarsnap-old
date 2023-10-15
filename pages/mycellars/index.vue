<script setup>
  definePageMeta({
    middleware: ["auth"],
  });
  
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const toast = useToast()

  const mycellars = ref([]);

  const addCellar = ref(false);
  const deleteCellarModal = ref(false);


  async function logout() {
    try {
      const { error } = await supabase.auth.signOut(); 
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      toast.add({
        id: 'addBottleToDBError',
        title: 'ERROR',
        description: error.message,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red'
      })
    }
  }

  async function getAllCellar() {
    try {
      const { data, error } = await supabase.from('mycellars').select()

      mycellars.value = data;
      if (error) throw error;
    } catch (error) {
      toast.add({
        id: 'addBottleToDBError',
        title: 'ERROR',
        description: error.message,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red'
      })
    }
  }

  async function createCellar() {
    const { cellarName } = this.createCellar;
    const createdCellar = ref();

    try {
      const { data: newCellar, error } = await supabase.from('mycellars').insert({ name: cellarName, user_id: user.value.id }).select();

      createdCellar.value = newCellar[0];
      router.push('/mycellars/' + createdCellar.value.id)

      if (error) throw error;
    } catch (error) {
      toast.add({
        id: 'addBottleToDBError',
        title: 'ERROR',
        description: error.message,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red'
      })
    }
  }

  async function removeBottle(id) {
    try {
      alert('This will remove the Cellar forever!')
      const { error } = await supabase.from('mycellars').delete().eq('id', id);
      getAllCellar();
    } catch (error) {
      toast.add({
        id: 'addBottleToDBError',
        title: 'ERROR',
        description: error.message,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red'
      })
    }
  }

  onMounted(() => {
    getAllCellar();
  })
</script>

<template>
  <Sidebar />
  <div class="p-10 md:ml-72">
    <h1>{{ user.email }}</h1>
    <button @click="logout">signout</button>

    <UButton v-show="mycellars.length <= 0" class="w-fit" label="Create New Cellar" @click="addCellar = true">
      <template #leading>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.75 2a.75.75 0 0 0-.75.75v7a5.751 5.751 0 0 0 5 5.701v5.057L8.753 20.5a.75.75 0 0 0-.006 1.5l3 .011h.005l3.5-.011a.75.75 0 0 0-.004-1.5l-2.748.009v-5.053A6.251 6.251 0 0 0 18 9.25v-6.5a.75.75 0 0 0-.75-.75H6.75Zm.75 5V3.5h9V7h-9Zm8.183 2.707a3.727 3.727 0 0 1-1.159 2.066a3.753 3.753 0 0 1-1.754.898a.5.5 0 0 1-.205-.979a2.736 2.736 0 0 0 1.286-.658a2.763 2.763 0 0 0 .85-1.515a.5.5 0 0 1 .982.188Z"/></svg>
      </template>
    </UButton>

    <!-- <div v-for="mycellar in mycellars" :key="mycellar.id">
      <NuxtLink key={mycellar.id} :to="`/mycellars/${mycellar.id}`">
        <div class="cursor-pointer border-b border-gray-300 mt-8 pb-4">
          <h2 class="text-xl font-semibold">{{ mycellar.name }}</h2>
        </div>
      </NuxtLink>
    </div> -->

    <div>
      <div v-for="mycellar in mycellars" :key="mycellar.id" class="flex flex-col sm:flex-row w-full border-b border-gray-300 mt-8 pb-4">
        <div class="basis-1/3 grow">
          <NuxtLink key={mycellar.id} :to="`/mycellars/${mycellar.id}`">
            <div class="cursor-pointer">
              <h2 class="text-xl font-semibold capitalize">{{ mycellar.name }}</h2>
            </div>
          </NuxtLink>
        </div>

        <div class="basis-1/4 flex sm:flex-row content-center items-center justify-between">
          <UButton label="Delete Cellar" color="red" @click="deleteCellarModal = true" />
        </div>

        <div>
          <UModal v-model="deleteCellarModal">
            <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
              <template #header>
                <h2 class="text-2xl">Delete {{ mycellar.name }}</h2>
              </template>
                <p>This action will delete the Cellar and all vino you have added forever!</p>
              <template #footer>
                <div class="flex flex-row place-content-between">
                  <UButton @click="deleteCellarModal = false">Cancel</UButton>
                  <UButton color="red" @click="removeBottle(mycellar.id)">Delete Cellar</UButton>
                </div>
              </template>
            </UCard>
          </UModal>
        </div>
      </div>
    </div>
  </div>

  <div>
    <USlideover v-model="addCellar" prevent-close>
      <UCard class="flex flex-col flex-1" :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Create New Cellar
            </h3>
            
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="addCellar = false" />
          </div>
        </template>
        
        <UForm>
          <div class="h-full flex flex-col gap-4">
            <UFormGroup label="New Cellar Name" name="cellarName">
              <UInput type="text" name="cellarName" placeholder="Cellar Name" v-model="createCellar.cellarName" class="w-full" />
            </UFormGroup>

            <UButton
              type="button"
              block
              @click="createCellar()"
            >Create New Cellar</UButton>
          </div>
        </UForm>
      </UCard>
    </USlideover>
  </div>
</template>