"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button, buttonClass } from "@/components/ui/Button";
import { SystemPage } from "./_components/SystemPage";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <SystemPage code="500" codeClass="text-plus" title="ระบบขัดข้องชั่วคราว" body="ไม่ใช่ความผิดของคุณ ลองใหม่อีกครั้งได้เลย">
      <Button onClick={() => retry()}>ลองใหม่อีกครั้ง</Button>
      <Link href="/" className={buttonClass("ghost")}>
        กลับหน้าแรก
      </Link>
    </SystemPage>
  );
}
