: any: { [x: string]: string; }: number: any, reginInfo
<template>
  <div>
    <Picker
      show-toolbar
      :columns="columns"
      :loading="loading"
      @change="onChange"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { Picker } from "vant";

import { reactive, ref, onMounted } from "vue";
import { getRegion, reginInfo } from "../../../utils/api";

const props = withDefaults(defineProps<{ regionArr: string[] }>(), {
  regionArr: () => ["北京", "北京", "东城区"],
});

const emit = defineEmits(["confirm", "cancel"]);

let provinceArr: reginInfo[] = [];
let provinceIdx = 0;
let cityArr: reginInfo[] = [];
let cityIdx = 0;
let areaArr: reginInfo[] = [];
let areaIdx = 0;

const columns = reactive<{ values: string[]; defaultIndex: number }[]>([
  {
    values: [],
    defaultIndex: 0,
  },
  {
    values: [],
    defaultIndex: 0,
  },
  {
    values: [],
    defaultIndex: 0,
  },
]);
const loading = ref(false);

onMounted(() => initRegion());

const initRegion = async () => {
  loading.value = true;

  provinceArr = await getRegion();
  const provinceNameArr = provinceArr.map((item) => item.name);
  provinceIdx = provinceNameArr.findIndex(
    (item) => props.regionArr[0] === item
  );
  columns[0].values = provinceNameArr;
  columns[0].defaultIndex = provinceIdx;

  cityArr = await getRegion(provinceArr[provinceIdx].id, 2);
  const cityNameArr = cityArr.map((item) => item.name);
  cityIdx = cityNameArr.findIndex((item) => props.regionArr[1] === item);
  columns[1].values = cityNameArr;
  columns[1].defaultIndex = cityIdx;

  areaArr = await getRegion(cityArr[cityIdx].id, 3);
  const areaNameArr = areaArr.map((item) => item.name);
  areaIdx = areaNameArr.findIndex((item) => props.regionArr[2] === item);
  columns[2].values = areaNameArr;
  columns[2].defaultIndex = areaIdx;

  loading.value = false;
};

const onChange = async (value: { [x: string]: string }, index: number) => {
  if (index === 0) {
    provinceIdx = provinceArr.findIndex((item) => value[index] === item.name);
    cityArr = await getRegion(provinceArr[provinceIdx].id, 2);
    cityIdx = 0;
    const cityNameArr = cityArr.map((item) => item.name);
    columns[1].values = cityNameArr;
    columns[1].defaultIndex = cityIdx;

    areaArr = await getRegion(cityArr[cityIdx].id, 3);
    const areaNameArr = areaArr.map((item) => item.name);
    areaIdx = 0;
    columns[2].values = areaNameArr;
    columns[2].defaultIndex = areaIdx;
  }

  if (index === 1) {
    cityIdx = cityArr.findIndex((item) => value[index] === item.name);
    areaArr = await getRegion(cityArr[cityIdx].id, 3);
    const areaNameArr = areaArr.map((item) => item.name);
    areaIdx = 0;
    columns[2].values = areaNameArr;
    columns[2].defaultIndex = areaIdx;
  }

  if (index === 2) {
    areaIdx = areaArr.findIndex((item) => value[index] === item.name);
  }
};

const onConfirm = (value: any) => {
  const regionIdArr = [
    provinceArr[provinceIdx].id,
    cityArr[cityIdx].id,
    areaArr[areaIdx].id,
  ];
  emit("confirm", value, regionIdArr);
};

const onCancel = () => emit("cancel");
</script>
