import { http } from "@/utils/http";
import { ref } from "vue";

export interface MessageInfo {
  icon: string;
  title: string;
  content: string;
  newsCount: number;
  time: string;
}
