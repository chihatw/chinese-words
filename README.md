## install
```zsh
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom@6 firebase
```

### vercel reload not found を防ぐ
- [official document](https://vercel.com/docs/project-configuration#project-configuration/rewrites)
- プロジェクト直下に `vercel.json` 作成
```json
{
  "rewrites":  [
    {"source": "/(.*)", "destination": "/"}
  ]
}
```

### type Character の変更
