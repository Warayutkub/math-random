import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { SystemPage } from "./_components/SystemPage";

export default function NotFound() {
  return (
    <SystemPage code="404" codeClass="text-primary" title="ไม่เจอหน้านี้" body="ลิงก์อาจพิมพ์ผิด หรือหน้านี้ถูกย้ายไปแล้ว">
      <Link href="/" className={buttonClass("primary")}>
        กลับไปเล่นเกม
      </Link>
    </SystemPage>
  );
}
