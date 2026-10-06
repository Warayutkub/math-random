# เลขใกล้เคียง (Math Random)

เกมคณิตศาสตร์: สุ่มตัวเลข 5 ตัว (1–10) และเลขเป้าหมาย (20–99) ผู้เล่นใช้ + − × ÷ รวมตัวเลขให้ได้ใกล้เป้าที่สุดภายใน 60 วินาที

- ใช้ตัวเลขแต่ละตัวได้ครั้งเดียว ไม่จำเป็นต้องใช้ครบ
- ผลระหว่างทางต้องเป็นจำนวนเต็มบวก (ลบแล้วต้องมากกว่า 0, หารต้องลงตัว)
- จบรอบแล้วมีเฉลย ซึ่งหาโดยลองทุกวิธีที่เป็นไปได้ ([lib/game/solver.ts](lib/game/solver.ts))

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # unit tests (Vitest)
npm run test:coverage
npm run lint && npm run typecheck
```

## Structure

| Path | What |
|---|---|
| `lib/game/` | game logic เป็นฟังก์ชันล้วน ไม่มี React: กติกา, สุ่มรอบ, solver, reducer ของ state |
| `app/_components/` | UI ของเกม (`Game.tsx` เป็น client component) |
| `components/ui/` | ปุ่มพื้นฐาน |
| `app/tokens.css` | design tokens ที่สร้างจาก Figma (ไฟล์ `math-random`) ด้วย wara-bridge ห้ามแก้ด้วยมือ |

## CI/CD

```
feature branch → Pull Request → GitHub Actions (lint, typecheck, tests + coverage ≥ 80%, Docker build + smoke test)
              → merge into main → CI ผ่านบน main → Render build Dockerfile แล้ว deploy
```

- **CI**: [.github/workflows/ci.yml](.github/workflows/ci.yml)
- **Container**: [Dockerfile](Dockerfile) (multi-stage, Next.js `output: "standalone"`, รันด้วย user ที่ไม่ใช่ root)
- **Render**: [render.yaml](render.yaml) (Blueprint, `autoDeployTrigger: checksPass`)

### ตั้งค่าครั้งแรก

1. push repo ขึ้น GitHub
2. Render → **New → Blueprint** → เลือก repo แล้ว Render จะอ่าน `render.yaml` เอง
3. GitHub → Settings → Branches → ตั้ง branch protection ให้ `main`: ต้องผ่าน PR และ status checks `Lint & typecheck`, `Unit tests`, `Docker build & smoke test`

### รัน Docker เอง

```bash
docker build -t math-random .
docker run -p 3000:3000 math-random
```
