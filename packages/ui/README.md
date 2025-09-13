# @bonusmax/ui

Componente UI de bază (stil shadcn/ui) pentru monorepo.

- Fără build separat – exporturi TypeScript simple
- Folosește Tailwind din aplicațiile consumatoare

## Utilizare

1. Adaugă alias în `tsconfig.json` al aplicației dacă nu există deja:

```jsonc
{
  "compilerOptions": {
    "paths": {
      "@bonusmax/ui": ["../../packages/ui"]
    }
  }
}
```

2. Include pachetul în `transpilePackages` din `next.config.ts`:

```ts
transpilePackages: ['@bonusmax/ui']
```

3. Opțional, importă presetul Tailwind în `tailwind.config.ts` al aplicației:

```ts
import uiPreset from '../../packages/ui/tailwind-preset';
export default { presets: [uiPreset] };
```

4. Importează componentele:

```tsx
import { Button, Card, Input, Badge } from '@bonusmax/ui';
```
