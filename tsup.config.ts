import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // 라이브러리 진입점
  format: ['cjs', 'esm'], // CommonJS와 ESModule 둘 다 지원
  dts: true, // 타입 정의 파일(.d.ts) 생성
  splitting: false,
  sourcemap: true,
  clean: true, // 빌드 전 dist 폴더 정리
});