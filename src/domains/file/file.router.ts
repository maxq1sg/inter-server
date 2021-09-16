import { Router } from "express";
import upload from "./multer.config";

export default function initFileRouter(router: Router) {
  router.post("/", upload.single("file"), this.addNewFileToStorage);
}
