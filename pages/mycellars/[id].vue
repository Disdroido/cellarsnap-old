<script setup>
definePageMeta({
  middleware: ["auth"],
});

const supabase = useSupabaseClient();
const route = useRoute();
const user = useSupabaseUser();

const slidoverIsOpen = ref(false);
const addBottleToDBSlider = ref(false);
const toast = useToast();

const mycellar = ref([]);
const myBottles = ref([]);
const bottles = ref([[]]);

// Dropdown search ref
const selected = ref(bottles[0]);

const searchFilter = ref('')

async function getCellar() {
  try {
    const { data, error } = await supabase
      .from("mycellars")
      .select()
      .filter("id", "eq", route.params.id)
      .single();

    mycellar.value = data;

    if (error) throw error;
  } catch (error) {
    toast.add({
      id: "addBottleToDBError",
      title: "ERROR",
      description: error.message,
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  }
}

async function getMyBottles() {
  try {
    const { data, error } = await supabase
      .from("mybottles")
      .select("*, bottles (*)")
      .filter("cellar_owner", "eq", route.params.id)
      .order("created_at", { ascending: true });

    data.map((myBottle) => {
      myBottles.value = data;
    });
    // myBottles.value = data;

    if (error) throw error;
  } catch (error) {
    toast.add({
      id: "addBottleToDBError",
      title: "ERROR",
      description: error.message,
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  }
}

const filteredBottles = computed(() => {
  if (searchFilter.value === '') {
    console.log(myBottles.value)
    return myBottles.value;
  } else if (searchFilter.value !== '') {
    const searchValue = searchFilter.value.toLowerCase();
    return myBottles.value.filter(myBottle => 
      myBottle.bottles.searchable_name.toLowerCase().includes(searchValue)
    );
  }
});


// const filteredItems = computed( () => {
//   if (searchFilter.value !== '') {
//     return myBottles.filter(myBottle => 
//       myBottle.bottles.searchable_name.includes(searchFilter.value) || 
//       myBottle.bottles.brand.includes(searchFilter.value) || 
//       myBottle.bottles.type.includes(searchFilter.value)
//     );
//   }

//   return myBottles;
// })

async function drankBottle(id) {
  try {
    const selectedBottle = ref();
    const { data, error } = await supabase
      .from("mybottles")
      .select("id, amount")
      .filter("id", "eq", id)
      .single();

    selectedBottle.value = data;
    const minusBottle = parseInt(selectedBottle.value.amount) - 1;

    if (error) throw error;
    try {
      const { error } = await supabase
        .from("mybottles")
        .update({ id: id, amount: minusBottle })
        .filter("id", "eq", id);
      await getMyBottles();

      if (minusBottle <= 0) {
        await removeBottle(id);
        myBottles.value = [];
      }

      if (error) throw error;
    } catch (error) {
      toast.add({
        id: "addBottleToDBError",
        title: "ERROR",
        description: error.message,
        icon: "i-heroicons-exclamation-circle",
        color: "red",
      });
    }
  } catch (error) {
    toast.add({
      id: "addBottleToDBError",
      title: "ERROR",
      description: error.message,
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  }
}

async function removeBottle(id) {
  try {
    const { error } = await supabase.from("mybottles").delete().eq("id", id);
    getMyBottles();

    if (error) throw error;
  } catch (error) {
    toast.add({
      id: "addBottleToDBError",
      title: "ERROR",
      description: error.message,
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  }
}

async function allBottles() {
  try {
    const { data, error } = await supabase.from("bottles").select();
    bottles.value = data;

    if (error) throw error;
  } catch (error) {
    toast.add({
      id: "addBottleToDBError",
      title: "ERROR",
      description: error.message,
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  }
}

async function addBottle() {
  const { amount } = this.addBottle;
  // check if bottle exists already
  try {
    const filteredBottles = myBottles.value
      .map((bottle) => bottle.bottle)
      .includes(selected.value.id);

    if (filteredBottles === false || amount !== "0") {
      try {
        const { error } = await supabase.from("mybottles").insert({
          cellar_owner: route.params.id,
          user_id: user.value.id,
          bottle: selected.value.id,
          amount: amount,
        });

        getMyBottles();
        slidoverIsOpen.value = false;

        if (error) throw error;
      } catch (error) {
        toast.add({
          id: "addBottleToDBError",
          title: "ERROR",
          description: error.message,
          icon: "i-heroicons-exclamation-circle",
          color: "red",
        });
      }
    } else {
      throw error;
    }
  } catch (error) {
    toast.add({
      id: "addBottleToDBError",
      title: "ERROR",
      description: "Need Amount",
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  }
}

async function addBottleToDB() {
  const { bottleName, bottleType, bottleVintage, bottleBrand } =
    this.addBottleToDB;
  const searchable_name = ref(
    [bottleBrand, "|", bottleName, bottleType, bottleVintage]
      .filter(Boolean)
      .join(" ")
  );

  const { data: bottlesData, error: bottlesError } = await supabase
    .from("bottles")
    .select("id")
    .eq("searchable_name", searchable_name.value);

  if (bottlesData.length === 0) {
    try {
      const { data, error } = await supabase
        .from("bottles")
        .insert({
          name: bottleName,
          type: bottleType,
          vintage: bottleVintage,
          brand: bottleBrand,
          searchable_name: searchable_name.value,
        })
        .select()
        .eq("searchable_name", searchable_name.value);

      addBottleToDBSlider.value = false;

      selected.value = data[0];

      if (error) throw error;
    } catch (error) {
      console.log(error.message);
      toast.add({
        id: "addBottleToDBError",
        title: "ERROR",
        description: error.message,
        icon: "i-heroicons-exclamation-circle",
        color: "red",
      });
    }
  } else {
    console.log("bottle exists");
    toast.add({
      id: "addBottleToDB",
      title: "Bottle Exists",
      description: "The bottle already exists.",
      icon: "i-heroicons-document-duplicate",
      color: "red",
    });
  }
}

onMounted(async () => {
  getCellar();
  getMyBottles();
  allBottles();
  addBottle();
  addBottleToDB();
});
</script>

<template>
  <Sidebar />
  <div class="p-10 md:ml-72">
    <div
      class="flex flex-col sm:flex-row place-content-between place-items-center">
      <h1 class="w-fit text-3xl capitalize underline">{{ mycellar.name }}</h1>
    </div>

    <div>
      <div
        class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        <div class="w-full md:w-1/2">
          <form class="flex items-center">
            <label for="simple-search" class="sr-only">Search</label>
            <div class="relative w-full">
              <div
                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  class="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewbox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <!-- <SearchForm @searchMyBottles="handleSearchMyBottles" /> -->
              <input
                type="text"
                v-model="searchFilter"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Search"
                required="" />
            </div>
          </form>
        </div>
        <div
          class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <UButton
            class="w-fit"
            label="Add New Bottle To Cellar"
            @click="slidoverIsOpen = true">
            <template #leading>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M6.75 2a.75.75 0 0 0-.75.75v7a5.751 5.751 0 0 0 5 5.701v5.057L8.753 20.5a.75.75 0 0 0-.006 1.5l3 .011h.005l3.5-.011a.75.75 0 0 0-.004-1.5l-2.748.009v-5.053A6.251 6.251 0 0 0 18 9.25v-6.5a.75.75 0 0 0-.75-.75H6.75Zm.75 5V3.5h9V7h-9Zm8.183 2.707a3.727 3.727 0 0 1-1.159 2.066a3.753 3.753 0 0 1-1.754.898a.5.5 0 0 1-.205-.979a2.736 2.736 0 0 0 1.286-.658a2.763 2.763 0 0 0 .85-1.515a.5.5 0 0 1 .982.188Z" />
              </svg>
            </template>
          </UButton>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-4 py-3">Vino name</th>
              <th scope="col" class="px-4 py-3">Vino Type</th>
              <th scope="col" class="px-4 py-3">Vino Brand</th>
              <th scope="col" class="px-4 py-3">Vino Amount</th>
              <th scope="col" class="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody id="myBottlesList">
            
            <tr v-for="myBottle in filteredBottles" :key="myBottle.bottles.id">
              <th
                scope="row"
                class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ myBottle.bottles.searchable_name }}
              </th>
              <td class="px-4 py-3">{{ myBottle.bottles.type }}</td>
              <td class="px-4 py-3">{{ myBottle.bottles.brand }}</td>
              <td class="px-4 py-3">{{ myBottle.amount }}</td>
              <td class="px-4 py-3 flex items-center justify-start">
                <button @click="drankBottle(myBottle.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18"><path fill="currentColor" d="M13 7v2h2v8h2V7h-4m-2 6H5v-2h6v2Z"/></svg>
                </button>
                <button @click="removeBottle(myBottle.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12Z"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div>
    <USlideover v-model="slidoverIsOpen" prevent-close>
      <UCard
        class="flex flex-col flex-1"
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Add New Bottle To Cellar
            </h3>

            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="slidoverIsOpen = false" />
          </div>
        </template>

        <UForm>
          <div class="h-full flex flex-col gap-4">
            <UFormGroup label="Search For Bottle" name="search">
              <USelectMenu
                v-model="selected"
                :options="bottles"
                placeholder="Search for a bottle..."
                name="searchable_name"
                option-attribute="searchable_name"
                by="id"
                searchable
                searchable-placeholder="Search bottle name..." />
            </UFormGroup>

            <UFormGroup label="Bottle Amount" name="amount">
              <UInput
                type="number"
                name="amount"
                placeholder="Number of bottles"
                v-model="addBottle.amount"
                class="w-full" />
            </UFormGroup>

            <UButton type="button" block @click="addBottle()"
              >Add Bottle</UButton
            >

            <button
              @click="addBottleToDBSlider = true"
              class="uppercase text-xs">
              can't find your bottle? add it here!
            </button>
          </div>
        </UForm>
      </UCard>
    </USlideover>

    <USlideover v-model="addBottleToDBSlider" prevent-close class="z-[100]">
      <UCard
        class="flex flex-col flex-1"
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Add New Bottle
            </h3>

            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="addBottleToDBSlider = false" />
          </div>
        </template>

        <UForm>
          <div class="h-full flex flex-col gap-4">
            <UFormGroup label="Brand" name="brand">
              <UInput
                type="text"
                name="brand"
                placeholder="The brand of the bottle"
                v-model="addBottleToDB.bottleBrand"
                class="w-full" />
            </UFormGroup>

            <UFormGroup label="Name" name="name">
              <UInput
                type="text"
                name="name"
                placeholder="The name of the bottle"
                v-model="addBottleToDB.bottleName"
                class="w-full" />
            </UFormGroup>

            <UFormGroup label="Type" name="type">
              <UInput
                type="text"
                name="type"
                placeholder="The type of wine"
                v-model="addBottleToDB.bottleType"
                class="w-full" />
            </UFormGroup>

            <UFormGroup label="Vintage" name="vintage">
              <UInput
                type="text"
                name="vintage"
                placeholder="The year it was made"
                v-model="addBottleToDB.bottleVintage"
                class="w-full" />
            </UFormGroup>

            <UButton type="button" block @click="addBottleToDB()"
              >Add New Bottle</UButton
            >
          </div>
        </UForm>
      </UCard>
    </USlideover>
  </div>
</template>
