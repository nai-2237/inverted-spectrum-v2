Inverted Spectrum — CMS 同步整合包

1. 將本 ZIP 內的 js、data、scripts 資料夾與 package.json 放到原專案根目錄，合併資料夾並覆蓋同名 js 檔。
2. 不要刪除原本的 data/articles.json 與 data/daily-gallery.json；包內 legacy-*.json 是本次上傳的兩份原始資料備份。
3. 目前文章 Markdown 的基本段落、標題、清單、單獨成段的圖片可轉換；閱讀頁仍是純文字呈現，不支援完整 Markdown 排版。
4. 後台圖片路徑應為 /assets/uploads/xxx.png 或 assets/uploads/xxx.png；圖片檔名建議英文、數字、連字號。
5. 部署到 Vercel 時，Build Command 設定為 npm run build；Output Directory 留空（靜態根目錄）；Framework Preset 選 Other。
6. 本機測試需先安裝 Node.js，於專案根目錄執行 npm install、npm run build，再用 Live Server 開啟網站。
7. 尚未完成 GitHub OAuth；admin/config.yml 裡的 repo 佔位符必須在建立倉庫後替換。Decap CMS 的 GitHub backend 在 Vercel 上需要另外設定 OAuth 認證服務。
8. CMS 新增內容需透過 GitHub 儲存並觸發 Vercel build 才會更新公開頁面。
9. 為避免舊資料遭覆蓋，原始資料保留在 data/legacy-*.json；後續若直接編輯 data/articles.json，下次建置會以 legacy 與 CMS 資料重新產生，請勿將其當作主要編輯來源。
