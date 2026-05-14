tailwind.config = {
    theme: {
        extend: {
            colors: { primary: { DEFAULT: '#2563eb' } }
        }
    }
}


const CONFIG = {
    spreadsheetId: "1DLkKZjF2w5ptTAkep9SYc3kxGBGZeLCgZ4e0qzxFN_E",
    authSheetName: "DSNV",
    noteSheetName: "GHI_CHU",
    expenseSheetName: "CHI_TIEU",
    learningSheetName: "NOTE_HOC_HOI",
    cdSheetName: "CD",
    serviceAccountEmail: "test-gia-ason@api-test-sheet-161.iam.gserviceaccount.com",
    imgbbApiKey: "7d0d08659d4812f8623080aa5589c362", // Demo API Key
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3NN84hLTkQPZd\nLj7niXZTICq7nHsuTn3J6r2Paq12m70/lYSmrwh1i0EStr9bO19QM8cevGlslwGr\nWSVOLJlc6+w1HGPKvRXtA41kYV9MYIvpzIPQtkFE7Hxq71QyBARcv39Lfzze6Ioj\n3G8VBvAKFLAnCUr97GHRv+KbCTFxPZupd3PEB+xS5ZUlzdBCEZvDid3iXaaEJJ+l\nTd1apAGQHjtnDTLOkiTa8zf7X5ebALwnI9MziOdN8VyprHXGhkachPbKyrG0QwEs\n2jtiI6Y5ULsBPjNefoavH8MKU5DEAT9h0fZ7KfsKYVMDuXqmEKBs0D3B4Z6aDZQW\nwT2dDRZDAgMBAAECggEAEIuVoSzZVuFhaz1GI9ji0IacjvO50cIq7M8Zrj4/F756\nEw6PIhKENafAb7U4INm2AnzUMO8CqL9Jpxs85qUM3W4JysSByqLUiRW2184amIyb\nj7jCXfLBTQn8AbHgrUepl5d/vBmFYMgon/mqjbNiGDb4FZgEQSkie5o6fi/dWp5d\nNahbZl+WTOB/znhAfKh/zferHNxldR/ERmwOubZUerkqysWiBigc3ovpLSUof9ur\nz3hNPPp0CKQjF40xuQc6FYTHUHMLuMvp78PXuc/mYqQmZ8VOGhU+faGtZ4m+QJly\ndF5dS8U5cwKEF+ptuAUiWSahn6INb9yKn3+FcsW0UQKBgQDb8N4eWFvbgpRo/vxo\nwBN2u2TWubj6clcrq/1a+VR0njC28Can0ogJHhrFhPxVs5D/rugs3HlbyAXJFptY\nV0DZPCwBxGU5P5RbGjXWWEUXjp4ISKQD8WKfVlXNr79TqLdOg2NZBYQAi06Cpo/T\nPV9l7LSG2Tj/9WdvD7W2wvrpaQKBgQDVPjpJN6xh7+sHtSU0mjKvrqigpHbuSQ/o\nXpUaWSIpJffm5QpFPAOcTT5mHZCyllicJQIrfPSY+sH8n+sF03CUqVkV4Q2UqfOf\npFaLDB4P6SQ8iesZyF4VKFrj/cAvRJmp0e5W/DRnFkoEp+8c+nrru2+Dzm9kb7Uq\n0CiltqYAywKBgBtcfrV1to+7Ue0x84KwintV2rifyDRX7yI+tjkQFYKgf1zyyUxN\nc6D2vsvdvGqI+TvlrXqPPwW8/4NBrbeyux2LT8o0fYc+sp0WyKXOu2Gv21caelUH\nPYam/eultn6Y2Z0J2V0kw4Qx0GWOhQv5cZnDdb3k3iNxixmU8b03ynEpAoGBAKEA\n7O0fNe50QRZ+tOq0ihSPYQ55XrqnO3WNBDLynZJH8pbI1CpWF7vJrpVXOUs9rQWo\nA61mGR/wJMtiywaJEHWOL48PbzuR3jno0NcHfSMyOoPi9jlvSWncIFQH4TVPLF5F\n/Rh8L+ytrZE6YpWUoX6e9KGmGgDRPw5mQGpuL4RlAoGADe9n080SXlsUk4nHVjUz\nEfv7EBoBkgOpqb9T1foRfJl46NxmmTOYV3iGIhjwcDskEg284k4iq/gH6EEFyEBc\nVz13jzB1nBgjfezFesVQz7bA/+Wik6HZtxAxVg38BKMt+Q1tYw9wOjbGPqOn++VC\nsR2Sh8e3h3Knd6j1tceRIFU=\n-----END PRIVATE KEY-----\n",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
};

function normalizeKey(h) {
    if (!h) return '';
    return h.trim().toLowerCase()
        .replace(/\s+/g, '_')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, 'd');
}

let currentUser = null, accessToken = null, tokenExpiry = 0;
let notesData = [], expensesData = [], learningData = [], staffData = [];
let currentEditNoteId = null, currentEditExpenseId = null, currentEditLearningId = null;
let currentModule = 'notes';
let dailyCurrentPage = 1;
let selectedCalendarDayIso = '';
const tableSortState = {
    notes: { key: 'ngay', dir: 'desc' },
    expense: { key: 'ngay', dir: 'desc' },
    learning: { key: 'ngay', dir: 'desc' }
};

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

function compareTableValues(a, b, key, type) {
    if (['ngay', 'ngay_h', 'ngay_in'].includes(key)) {
        const getDateValue = (row) => {
            if (type === 'expense') return row.ngay_h || row.ngay;
            if (type === 'notes') return row.ngay_in || row.ngay;
            return row.ngay;
        };
        return parseSortDateDaily(getDateValue(a)) - parseSortDateDaily(getDateValue(b));
    }
    if (key === 'so_tien') return (parseFloat(a.so_tien) || 0) - (parseFloat(b.so_tien) || 0);
    return String(a[key] || '').localeCompare(String(b[key] || ''), 'vi', { sensitivity: 'base' });
}

function sortRows(rows, tableName) {
    const state = tableSortState[tableName];
    if (!state) return rows;
    return [...rows].sort((a, b) => {
        const result = compareTableValues(a, b, state.key, tableName);
        return state.dir === 'asc' ? result : -result;
    });
}

function setTableSort(tableName, key) {
    const state = tableSortState[tableName];
    if (!state) return;
    if (state.key === key) state.dir = state.dir === 'asc' ? 'desc' : 'asc';
    else {
        state.key = key;
        state.dir = ['ngay', 'so_tien'].includes(key) ? 'desc' : 'asc';
    }
    if (tableName === 'notes') renderNotes();
    if (tableName === 'expense') renderExpenses();
    if (tableName === 'learning') renderLearning();
}

function openTextPreview(title, text, meta = '') {
    if (!text) return;
    let overlay = document.getElementById('textPreviewOverlay');
    if (!overlay) {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="textPreviewOverlay" onclick="closeTextPreview()" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120] hidden"></div>
            <div id="textPreviewModal" class="text-preview-modal fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-2xl bg-white rounded-2xl shadow-2xl z-[121] hidden opacity-0 scale-95 overflow-hidden">
                <div class="p-5 border-b flex items-start justify-between gap-4">
                    <div>
                        <h3 id="textPreviewTitle" class="font-bold text-slate-900 text-lg"></h3>
                        <p id="textPreviewMeta" class="text-xs text-slate-500 mt-1"></p>
                    </div>
                    <button onclick="closeTextPreview()" class="p-2 rounded-lg hover:bg-slate-100 text-slate-500">✕</button>
                </div>
                <div id="textPreviewBody" class="p-5 max-h-[65vh] overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-slate-700"></div>
                <div class="p-4 border-t bg-slate-50 flex justify-end">
                    <button id="textPreviewCopyBtn" class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold">Copy</button>
                </div>
            </div>
        `);
        overlay = document.getElementById('textPreviewOverlay');
    }
    document.getElementById('textPreviewTitle').textContent = title;
    document.getElementById('textPreviewMeta').textContent = meta;
    document.getElementById('textPreviewBody').textContent = text;
    document.getElementById('textPreviewCopyBtn').onclick = () => navigator.clipboard.writeText(text);
    const modal = document.getElementById('textPreviewModal');
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0', 'scale-95'); modal.classList.add('opacity-100', 'scale-100'); }, 10);
}

function openRecordFieldPreview(kind, id, field, title) {
    const source = kind === 'notes' ? notesData : kind === 'expense' ? expensesData : learningData;
    const item = source.find(row => row.id === id);
    if (!item) return;
    openTextPreview(title, item[field] || '', item.ngay || item.ngay_h || '');
}

function closeTextPreview() {
    const overlay = document.getElementById('textPreviewOverlay');
    const modal = document.getElementById('textPreviewModal');
    if (!overlay || !modal) return;
    modal.classList.add('opacity-0', 'scale-95');
    modal.classList.remove('opacity-100', 'scale-100');
    setTimeout(() => { overlay.classList.add('hidden'); modal.classList.add('hidden'); }, 180);
}

async function getAccessToken() {
    if (accessToken && Date.now() < tokenExpiry - 300000) return accessToken;
    const header = { alg: "RS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const payload = { iss: CONFIG.serviceAccountEmail, scope: CONFIG.scopes.join(" "), aud: CONFIG.tokenUrl, exp: now + 3600, iat: now };
    const sJWT = KJUR.jws.JWS.sign("RS256", JSON.stringify(header), JSON.stringify(payload), CONFIG.privateKey);
    const res = await fetch(CONFIG.tokenUrl, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${sJWT}` });
    const data = await res.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000);
    return accessToken;
}

async function fetchSheetData(sheetName) {
    if (!sheetName) { console.error("fetchSheetData: sheetName is missing"); return []; }
    try {
        const token = await getAccessToken();
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}/values/${sheetName}!A1:Z2000`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.values && data.values.length > 1) {
            const headers = data.values[0];
            return data.values.slice(1).map(row => {
                let obj = {};
                headers.forEach((h, idx) => { if (h) obj[normalizeKey(h)] = row[idx] || ''; });
                return obj;
            }).reverse();
        }
        return [];
    } catch (err) { console.error("fetchSheetData error:", err); return []; }
}

// Cache sheet headers to avoid repeated API calls
const _sheetHeaderCache = {};
async function getSheetHeaders(sheetName, token) {
    if (_sheetHeaderCache[sheetName]) return _sheetHeaderCache[sheetName];
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}/values/${sheetName}!1:1`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const headers = (data.values?.[0] || []).map(h => normalizeKey(h));
    _sheetHeaderCache[sheetName] = headers;
    return headers;
}

async function appendToSheet(sheetName, rowData, columns, exactOrder = false) {
    const token = await getAccessToken();
    const headers = exactOrder ? [] : await getSheetHeaders(sheetName, token);
    // Map data to match actual sheet column order
    const row = (headers.length > 0 && !exactOrder)
        ? headers.map(h => { const v = rowData[h]; return v !== undefined && v !== null ? v : ''; })
        : columns.map(col => rowData[col] !== undefined && rowData[col] !== null ? rowData[col] : '');
    const colLength = Math.max(headers.length, columns.length);
    let colLetter = '';
    let tempLength = colLength;
    while (tempLength > 0) {
        let rem = (tempLength - 1) % 26;
        colLetter = String.fromCharCode(65 + rem) + colLetter;
        tempLength = Math.floor((tempLength - 1) / 26);
    }
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}/values/${sheetName}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
    const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ values: [row] })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err?.error?.message || res.statusText;
        throw new Error("Lỗi Google Sheets API: " + msg);
    }
    return res;
}

async function deleteFromSheet(sheetName, idValue) {
    try {
        const token = await getAccessToken();
        // 1. Get Spreadsheet data to find sheetId and rows
        const ssUrl = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}`;
        const ssRes = await fetch(ssUrl, { headers: { Authorization: `Bearer ${token}` } });
        const ssData = await ssRes.json();
        const sheet = ssData.sheets.find(s => s.properties.title === sheetName);
        if (!sheet) return false;
        const sheetId = sheet.properties.sheetId;

        // 2. Get values to find index
        const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}/values/${sheetName}!A1:Z2000`;
        const resGet = await fetch(getUrl, { headers: { Authorization: `Bearer ${token}` } });
        const data = await resGet.json();
        if (!data.values) return false;

        // Find index (1-based in sheets, but 0-based for request startIndex)
        const rowIndex = data.values.findIndex((row, idx) => idx > 0 && row[0] === idValue);
        if (rowIndex === -1) return false;

        const deleteReq = { requests: [{ deleteDimension: { range: { sheetId: sheetId, dimension: "ROWS", startIndex: rowIndex, endIndex: rowIndex + 1 } } }] };
        const resDel = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}:batchUpdate`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(deleteReq) });
        return resDel.ok;
    } catch (err) { return false; }
}

async function updateInSheet(sheetName, idValue, rowData, columns, exactOrder = false) {
    try {
        const token = await getAccessToken();
        const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}/values/${sheetName}!A1:Z2000`;
        const resGet = await fetch(getUrl, { headers: { Authorization: `Bearer ${token}` } });
        const data = await resGet.json();
        if (!data.values) return false;

        const headers = (data.values[0] || []).map(h => normalizeKey(h));
        const rowIndex = data.values.findIndex((row, idx) => idx > 0 && row[0] === idValue);
        if (rowIndex === -1) return false;

        // Map data to actual column order from header row
        const row = (headers.length > 0 && !exactOrder)
            ? headers.map(h => { const v = rowData[h]; return v !== undefined && v !== null ? v : ''; })
            : columns.map(col => rowData[col] !== undefined && rowData[col] !== null ? rowData[col] : '');
        const colLength = exactOrder ? columns.length : Math.max(headers.length, columns.length);
        let colLetter = '';
        let tempLength = colLength;
        while (tempLength > 0) {
            let rem = (tempLength - 1) % 26;
            colLetter = String.fromCharCode(65 + rem) + colLetter;
            tempLength = Math.floor((tempLength - 1) / 26);
        }
        const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}/values/${sheetName}!A${rowIndex + 1}:${colLetter}${rowIndex + 1}?valueInputOption=USER_ENTERED`;
        const resUpd = await fetch(updateUrl, { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ values: [row] }) });
        return resUpd.ok;
    } catch (err) { console.error('updateInSheet error:', err); return false; }
}

let loadDataPromise = null;
function loadAllData(force = true) {
    if (!force && loadDataPromise) return loadDataPromise;
    loadDataPromise = (async () => {
        const [nData, eData, lData, sData, cData] = await Promise.all([
            fetchSheetData(CONFIG.noteSheetName),
            fetchSheetData(CONFIG.expenseSheetName),
            fetchSheetData(CONFIG.learningSheetName),
            fetchSheetData(CONFIG.authSheetName),
            fetchSheetData(CONFIG.cdSheetName).catch(() => [])
        ]);
        notesData = nData; expensesData = eData; learningData = lData;
        staffData = sData; const cdData = cData || [];

        const staffSelect = document.getElementById('note_doi_tuong');
        if (staffSelect) {
            staffSelect.innerHTML = '<option value="">-- Chọn nhân viên --</option>' +
                staffData.map(s => `<option value="${s.ho_ten || s.ID}">${s.ho_ten || s.ID} (${s.ID})</option>`).join('');
        }

        const prevIdSelect = document.getElementById('note_id_ghi_chu_prev');
        if (prevIdSelect) {
            prevIdSelect.innerHTML = '<option value="">-- Chọn ID trước --</option>' +
                notesData.map(n => `<option value="${n.id}">${n.truong || 'Ghi chú'} (${n.id})</option>`).join('');
        }

        const danhMucList = document.getElementById('expense_danh_muc_list');
        if (danhMucList) {
            const cdItems = cdData.filter(c => (c.truong || '').toLowerCase() === 'chi_tieu');
            danhMucList.innerHTML = cdItems.map(c => `<option value="${c.id}">${c.id}</option>`).join('');
        }

        const noteTruongBtns = document.getElementById('add_note_truong_buttons');
        const notePanelTruongBtns = document.getElementById('note_truong_buttons');
        if (noteTruongBtns || notePanelTruongBtns) {
            const noteTypes = cdData.filter(c => (c.truong || '').toUpperCase() === 'GHI_CHU_TRUONG');
            const generateBtns = (isPanel) => noteTypes.map((c, idx) => {
                const isFirst = idx === 0;
                const fn = isPanel ? 'setTruong' : 'setAddNoteTruong';
                const cls = isPanel ? 'truong-btn px-4 py-2 rounded-xl border-2 font-medium transition-all' : 'px-3 py-1.5 text-xs font-medium rounded-xl transition-all';
                const activeCls = isPanel ? 'border-primary bg-blue-50 text-primary' : 'bg-primary text-white shadow-sm';
                const inactiveCls = isPanel ? 'border-slate-100 bg-slate-50 text-slate-600 hover:border-primary/50' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50';

                return `<button type="button" onclick="${fn}('${c.id}')" class="${cls} ${isFirst ? activeCls : inactiveCls}">${c.id}</button>`;
            }).join('');

            if (noteTruongBtns) noteTruongBtns.innerHTML = generateBtns(false);
            if (notePanelTruongBtns) notePanelTruongBtns.innerHTML = generateBtns(true);

            if (noteTypes.length > 0) {
                const firstId = noteTypes[0].id;
                if (document.getElementById('add_note_truong')) document.getElementById('add_note_truong').value = firstId;
                if (document.getElementById('note_truong')) document.getElementById('note_truong').value = firstId;
            }
        }

        const tkChiList = document.getElementById('expense_tk_chi_list');
        const tkThuList = document.getElementById('expense_tk_thu_list');
        if (tkChiList && tkThuList) {
            const uniqueTkChi = [...new Set(expensesData.map(e => e.tk_chi).filter(x => x))];
            const uniqueTkThu = [...new Set(expensesData.map(e => e.tk_thu).filter(x => x))];
            tkChiList.innerHTML = uniqueTkChi.map(v => `<option value="${v}"></option>`).join('');
            tkThuList.innerHTML = uniqueTkThu.map(v => `<option value="${v}"></option>`).join('');

            const tkChiBtns = document.getElementById('add_expense_tk_chi_buttons');
            const tkThuBtns = document.getElementById('add_expense_tk_thu_buttons');
            if (tkChiBtns && tkThuBtns) {
                tkChiBtns.innerHTML = uniqueTkChi.map(v => `<button type="button" onclick="setAddExpenseTkChi('${v}')" class="px-2 py-1 text-[10px] font-medium rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200">${v}</button>`).join('');
                tkThuBtns.innerHTML = uniqueTkThu.map(v => `<button type="button" onclick="setAddExpenseTkThu('${v}')" class="px-2 py-1 text-[10px] font-medium rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200">${v}</button>`).join('');
            }
        }

        renderNotes(); renderExpenses(); renderLearning();
    })();
    return loadDataPromise;
}

// GHI CHÚ
function renderNotes() {
    const container = document.getElementById('notesList');
    const fStart = document.getElementById('notes-filter-start')?.value;
    const fEnd = document.getElementById('notes-filter-end')?.value;
    const fSearch = (document.getElementById('notes-filter-search')?.value || "").toLowerCase().trim();

    let filtered = notesData.filter(n => {
        // Date Range Filter
        if (fStart || fEnd) {
            const ts = parseSortDateDaily(n.ngay);
            if (!ts) return false;
            const d = new Date(ts);
            d.setHours(0, 0, 0, 0);
            const dTs = d.getTime();

            if (fStart) {
                const s = new Date(fStart);
                s.setHours(0, 0, 0, 0);
                if (dTs < s.getTime()) return false;
            }
            if (fEnd) {
                const e = new Date(fEnd);
                e.setHours(0, 0, 0, 0);
                if (dTs > e.getTime()) return false;
            }
        }

        // Search Filter
        if (fSearch) {
            const content = `${n.truong} ${n.ghi_chu} ${n.noi_dung} ${n.doi_tuong} ${n.id}`.toLowerCase();
            if (!content.includes(fSearch)) return false;
        }

        return true;
    });

    filtered = sortRows(filtered, 'notes');

    if (!filtered.length) {
        container.innerHTML = '<tr><td colspan="9" class="p-12 text-center text-slate-400">📭 Không tìm thấy ghi chú nào phù hợp</td></tr>';
        return;
    }

    container.innerHTML = filtered.map(n => `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="text-xs text-slate-400 font-mono">${escapeHTML(n.id || '')}</td>
                    <td class="whitespace-nowrap font-bold text-slate-800">${escapeHTML(n.ngay || '')}</td>
                    <td class="text-xs text-slate-500 font-mono">${getTimePart(n.ngay_in)}</td>
                    <td class="text-xs text-slate-500 font-mono">${getTimePart(n.ngay_out)}</td>
                    <td><div class="font-bold text-primary">${escapeHTML(n.truong || '')}</div></td>
                    <td><div onclick="openRecordFieldPreview('notes','${n.id}','ghi_chu','Ghi chú')" class="preview-cell text-xs text-slate-500 max-w-[150px] whitespace-pre-wrap line-clamp-2">${escapeHTML(n.ghi_chu || '')}</div></td>
                    <td><div onclick="openRecordFieldPreview('notes','${n.id}','noi_dung','Nội dung')" class="preview-cell text-xs text-slate-500 max-w-[200px] whitespace-pre-wrap line-clamp-2">${escapeHTML(n.noi_dung || '')}</div></td>
                    <td class="font-bold text-rose-600 text-center">${calcAging(n.ngay)}</td>
                    <td class="text-center">
                        <div class="flex items-center justify-center gap-2">
                            ${n.linh_anh ? `<a href="${n.linh_anh}" target="_blank" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg">🖼️</a>` : ''}
                            <button onclick="editNote('${n.id}')" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                            </button>
                            <button onclick="deleteNote('${n.id}')" class="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Xóa">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </div>
                    </td>
                </tr>`).join('');
}

async function saveNote() {
    const btn = document.getElementById('btnSaveNote');
    const spinner = document.getElementById('saveSpinner');
    btn.disabled = true; spinner.classList.remove('hidden');

    const isEdit = !!currentEditNoteId;
    const id = isEdit ? currentEditNoteId : 'note_' + Date.now();
    const rawNgay = document.getElementById('note_ngay').value;
    const newData = {
        id: id,
        ngay: formatDateForSheet(rawNgay),
        ngay_in: formatDateTimeForSheet(document.getElementById('note_ngay_in').value),
        ngay_out: formatDateTimeForSheet(document.getElementById('note_ngay_out').value),
        truong: document.getElementById('note_truong').value,
        ghi_chu: document.getElementById('note_ghi_chu').value,
        noi_dung: document.getElementById('note_noi_dung').value,
        doi_tuong: document.getElementById('note_doi_tuong').value,
        dia_chi: document.getElementById('note_dia_chi').value,
        loai: '', id_gc: '', linh_anh: document.getElementById('note_linh_anh').value,
        anh: document.getElementById('note_anh').value, link: document.getElementById('note_link').value,
        file: document.getElementById('note_file').value, video: document.getElementById('note_video').value,
        nam_thang: rawNgay.substring(0, 7).replace('-', '/')
    };
    const columns = ['id', 'ngay', 'ngay_in', 'ngay_out', 'truong', 'ghi_chu', 'noi_dung', 'doi_tuong', 'dia_chi', 'loai', 'id_gc', 'linh_anh', 'anh', 'link', 'file', 'video', 'nam_thang'];

    if (isEdit) {
        await updateInSheet(CONFIG.noteSheetName, id, newData, columns, true);
        const idx = notesData.findIndex(x => x.id === id);
        if (idx !== -1) notesData[idx] = newData;
    } else {
        await appendToSheet(CONFIG.noteSheetName, newData, columns, true);
        notesData.unshift(newData);
    }

    currentEditNoteId = null;
    renderNotes();
    closeModal('notePanel');
    btn.disabled = false; spinner.classList.add('hidden');
}

function editNote(id) {
    const n = notesData.find(x => x.id === id);
    if (!n) return;
    currentEditNoteId = id;
    const noteDate = formatDateForInput(n.ngay || '');
    const noteIn = normalizeDateTimeLocal(n.ngay_in || n.ngay || '');
    const noteOut = normalizeDateTimeLocal(n.ngay_out || n.ngay_in || n.ngay || '');
    document.getElementById('note_ngay').value = noteDate;
    document.getElementById('note_ngay_in').value = noteIn || (noteDate ? `${noteDate}T00:00` : '');
    document.getElementById('note_ngay_out').value = noteOut || noteIn || (noteDate ? `${noteDate}T00:00` : '');
    setTruong(n.truong || 'Ghi chú');
    document.getElementById('note_ghi_chu').value = n.ghi_chu || '';
    document.getElementById('note_noi_dung').value = n.noi_dung || '';
    document.getElementById('note_doi_tuong').value = n.doi_tuong || '';
    document.getElementById('note_dia_chi').value = n.dia_chi || '';
    document.getElementById('note_linh_anh').value = n.linh_anh || '';
    document.getElementById('note_anh').value = n.anh || '';
    document.getElementById('note_link').value = n.link || '';
    document.getElementById('note_file').value = n.file || '';
    document.getElementById('note_video').value = n.video || '';

    document.getElementById('notePanel').classList.add('open');
    document.getElementById('notePanelOverlay').classList.add('open');
}

function createNewNote(dateValue = null) {
    currentEditNoteId = null;
    const now = dateValue ? new Date(`${dateValue}T${localISO(new Date()).split('T')[1]}`) : new Date();
    const dateStr = dateValue || formatLocalDate(now);
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    document.getElementById('note_ngay').value = dateStr;
    document.getElementById('note_ngay_in').value = dateStr + 'T' + timeStr;
    document.getElementById('note_ngay_out').value = dateStr + 'T' + timeStr;

    // Clear inputs
    document.getElementById('note_ghi_chu').value = '';
    document.getElementById('note_noi_dung').value = '';
    document.getElementById('note_doi_tuong').value = '';
    document.getElementById('note_dia_chi').value = '';
    document.getElementById('note_linh_anh').value = '';
    document.getElementById('note_anh').value = '';
    document.getElementById('note_link').value = '';
    document.getElementById('note_file').value = '';
    document.getElementById('note_video').value = '';

    // Trigger first field button if exists
    const firstBtn = document.querySelector('#note_truong_buttons button');
    if (firstBtn) firstBtn.click();
    else setTruong('Ghi chú');

    document.getElementById('notePanel').classList.add('open');
    document.getElementById('notePanelOverlay').classList.add('open');
}

async function deleteNote(id) {
    if (confirm('Xóa ghi chú?')) {
        await deleteFromSheet(CONFIG.noteSheetName, id);
        notesData = notesData.filter(x => x.id !== id);
        renderNotes();
    }
}

// CHI TIÊU
function renderExpenses() {
    const totalExpense = expensesData.filter(e => e.thu_chi?.toUpperCase() === 'CHI').reduce((s, e) => s + (parseFloat(e.so_tien) || 0), 0);
    const totalIncome = expensesData.filter(e => e.thu_chi?.toUpperCase() === 'THU').reduce((s, e) => s + (parseFloat(e.so_tien) || 0), 0);
    document.getElementById('totalExpense').innerHTML = totalExpense.toLocaleString() + ' đ';
    document.getElementById('totalIncome').innerHTML = totalIncome.toLocaleString() + ' đ';
    document.getElementById('totalBalance').innerHTML = (totalIncome - totalExpense).toLocaleString() + ' đ';

    const container = document.getElementById('expenseList');
    if (!expensesData.length) { container.innerHTML = '<tr><td colspan="7" class="p-8 text-center text-slate-400">Chưa có giao dịch</td></tr>'; return; }
    const sortedExpenses = sortRows(expensesData, 'expense');
    container.innerHTML = sortedExpenses.map(e => `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="whitespace-nowrap"><div class="font-bold text-slate-900">${escapeHTML(e.ngay || '')}</div>${e.ngay_h ? `<div class="text-xs text-slate-400">${getTimePart(e.ngay_h)}</div>` : ''}</td>
                    <td><span class="px-2 py-1 rounded text-xs font-bold ${e.thu_chi?.toUpperCase() === 'THU' ? 'bg-emerald-100 text-emerald-700' : e.thu_chi?.toUpperCase() === 'CHI' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}">${escapeHTML(e.thu_chi || '')}</span></td>
                    <td class="font-medium text-slate-700">${escapeHTML(e.danh_muc || '')}</td>
                    <td onclick="openRecordFieldPreview('expense','${e.id}','chi_tiet','Chi tiết')" class="preview-cell text-slate-500 max-w-[200px] truncate">${escapeHTML(e.chi_tiet || '')}</td>
                    <td class="text-xs text-slate-500">Nợ: <span class="font-medium text-slate-700">${escapeHTML(e.tk_chi || '-')}</span><br>Có: <span class="font-medium text-slate-700">${escapeHTML(e.tk_thu || '-')}</span></td>
                    <td class="whitespace-nowrap font-bold ${e.thu_chi?.toUpperCase() === 'THU' ? 'text-emerald-600' : e.thu_chi?.toUpperCase() === 'CHI' ? 'text-rose-600' : 'text-slate-700'}">
                        ${e.thu_chi?.toUpperCase() === 'THU' ? '+' : e.thu_chi?.toUpperCase() === 'CHI' ? '-' : ''} ${parseFloat(e.so_tien || 0).toLocaleString()} đ
                    </td>
                    <td class="text-center">
                        <div class="flex items-center justify-center gap-2">
                            <button onclick="editExpense('${e.id}')" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                            </button>
                            <button onclick="deleteExpense('${e.id}')" class="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Xóa">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
}

async function saveExpense() {
    const btn = document.querySelector('#expenseModal button.bg-primary');
    btn.disabled = true; btn.innerText = "Đang lưu...";

    const isEdit = !!currentEditExpenseId;
    const id = isEdit ? currentEditExpenseId : 'exp_' + Date.now();
    const thu_chi = document.getElementById('expense_thu_chi').value;
    const so_tien = document.getElementById('expense_so_tien').value || 0;
    const danh_muc = document.getElementById('expense_danh_muc').value;

    let so_tien_am = so_tien;
    if (thu_chi === 'CHI') so_tien_am = -so_tien;

    const rawNgay = document.getElementById('expense_ngay').value;
    const parts = rawNgay.split('-');
    const nam_thang = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : '';

    const tien_danh_muc = `${danh_muc} | ${so_tien}`;
    const tk_thu_chi = `${thu_chi} | ${so_tien}`;

    const newData = {
        id: id,
        ngay: formatDateForSheet(rawNgay),
        ngay_h: formatDateTimeForSheet(document.getElementById('expense_ngay_h').value),
        thu_chi: thu_chi,
        so_tien: so_tien,
        so_tien_am: so_tien_am,
        danh_muc: danh_muc,
        chi_tiet: document.getElementById('expense_chi_tiet').value,
        tk_chi: document.getElementById('expense_tk_chi').value,
        tk_thu: document.getElementById('expense_tk_thu').value,
        nam_thang: nam_thang,
        tien_danh_muc: tien_danh_muc,
        tk_thu_chi: tk_thu_chi
    };

    try {
        if (isEdit) {
            await updateInSheet(CONFIG.expenseSheetName, id, newData, [], false);
            const idx = expensesData.findIndex(x => x.id === id);
            if (idx !== -1) expensesData[idx] = newData;
        } else {
            await appendToSheet(CONFIG.expenseSheetName, newData, [], false);
            expensesData.unshift(newData);
        }
        renderExpenses();
        if (currentModule === 'dashboard') renderExpenseDashboard();
        closeModal('expenseModal');
        alert("Đã lưu giao dịch!");
    } catch (err) {
        alert("Lỗi: " + err.message);
    } finally {
        btn.disabled = false; btn.innerText = "Lưu giao dịch";
    }
}

function editExpense(id) {
    const row = expensesData.find(x => x.id === id);
    if (!row) return;
    currentEditExpenseId = id;
    document.getElementById('expense_ngay').value = formatDateForInput(row.ngay || '');
    document.getElementById('expense_ngay_h').value = normalizeDateTimeLocal(row.ngay_h || '');
    document.getElementById('expense_danh_muc').value = row.danh_muc || '';
    document.getElementById('expense_chi_tiet').value = row.chi_tiet || '';
    document.getElementById('expense_tk_chi').value = row.tk_chi || '';
    document.getElementById('expense_tk_thu').value = row.tk_thu || '';
    document.getElementById('expense_so_tien').value = row.so_tien || '';
    setExpenseThuChi((row.thu_chi || 'CHI').toUpperCase());
    document.getElementById('expenseModalOverlay').classList.add('open');
    document.getElementById('expenseModal').classList.add('open');
}

async function deleteExpense(id) {
    if (confirm('Xóa giao dịch?')) {
        await deleteFromSheet(CONFIG.expenseSheetName, id);
        expensesData = expensesData.filter(x => x.id !== id);
        renderExpenses();
    }
}

/* --- HỌC HỎI LOGIC --- */
async function copyLearningField(id, field, btn) {
    const item = learningData.find(l => l.id === id);
    const text = item?.[field] || '';
    if (!text) return;
    try {
        await navigator.clipboard.writeText(text);
        if (btn) {
            const oldText = btn.textContent;
            btn.textContent = '✓';
            setTimeout(() => { btn.textContent = oldText; }, 900);
        }
    } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
    }
}

function renderCopyButton(id, field) {
    return `<button type="button" onclick="event.stopPropagation(); copyLearningField('${id}', '${field}', this)" class="learning-copy-btn shrink-0 opacity-0 w-6 h-6 rounded-md text-slate-400 hover:text-primary hover:bg-blue-50 transition-all" title="Copy">⧉</button>`;
}

function renderLearning() {
    if (currentModule !== 'learning') return;
    const container = document.getElementById('learningList');
    if (!container) return;

    const searchQuery = (document.getElementById('learning-search-input')?.value || "").toLowerCase().trim();
    let filtered = learningData.filter(l => {
        if (!searchQuery) return true;
        const content = `${l.truong} ${l.noi_dung} ${l.ghi_chu} ${l.mota} ${l.id}`.toLowerCase();
        return content.includes(searchQuery);
    });
    filtered = sortRows(filtered, 'learning');

    container.innerHTML = filtered.map(l => `
                <tr class="hover:bg-slate-50 transition-colors group">
                    <td class="whitespace-nowrap font-medium text-slate-500 align-top">${escapeHTML(l.ngay || '')}</td>
                    <td class="align-top">
                        <div class="learning-cell flex items-start gap-2">
                            <div class="flex flex-wrap gap-1 flex-1 min-w-0">
                            ${(l.truong || '').split(',').map(t => `<span class="px-2 py-0.5 bg-blue-50 text-primary text-[10px] font-bold rounded-md border border-blue-100">${escapeHTML(t.trim())}</span>`).join('')}
                            </div>
                            ${l.truong ? renderCopyButton(l.id, 'truong') : ''}
                        </div>
                    </td>
                    <td class="align-top">
                        <div class="learning-cell flex items-start gap-2">
                            <div onclick="openRecordFieldPreview('learning','${l.id}','noi_dung','Nội dung')" class="preview-cell flex-1 min-w-0 font-bold text-slate-900 whitespace-pre-wrap break-words line-clamp-2">${escapeHTML(l.noi_dung || '')}</div>
                            ${l.noi_dung ? renderCopyButton(l.id, 'noi_dung') : ''}
                        </div>
                    </td>
                    <td class="align-top">
                        <div class="learning-cell flex items-start gap-2">
                            <div onclick="openRecordFieldPreview('learning','${l.id}','ghi_chu','Ghi chú')" class="preview-cell flex-1 min-w-0 text-slate-600 italic text-[10px] leading-snug line-clamp-2 whitespace-pre-wrap break-words">${escapeHTML(l.ghi_chu || '')}</div>
                            ${l.ghi_chu ? renderCopyButton(l.id, 'ghi_chu') : ''}
                        </div>
                    </td>
                    <td class="align-top">
                        <div class="learning-cell flex items-start gap-2">
                            <div onclick="openRecordFieldPreview('learning','${l.id}','mota','Mô tả')" class="preview-cell flex-1 min-w-0 text-slate-500 text-[11px] whitespace-pre-wrap break-words line-clamp-2">${escapeHTML(l.mota || '')}</div>
                            ${l.mota ? renderCopyButton(l.id, 'mota') : ''}
                        </div>
                    </td>
                    <td class="text-center align-top">
                        ${l.link ? `<a href="${l.link}" target="_blank" class="text-primary hover:underline font-bold">🔗</a>` : '-'}
                    </td>
                    <td class="text-center align-top">
                        <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onclick="editLearning('${l.id}')" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                            <button onclick="deleteLearning('${l.id}')" class="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                        </div>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="7" class="p-8 text-center text-slate-400 italic">Không tìm thấy bài học nào phù hợp</td></tr>';

    document.getElementById('totalLearning').innerText = learningData.length;
    document.getElementById('learningWithLink').innerText = learningData.filter(l => l.link && l.link.trim()).length;
    if (learningData.length > 0) document.getElementById('latestLearning').innerText = learningData[0].noi_dung || learningData[0].truong || '---';
}

async function saveLearning() {
    const btn = document.getElementById('btnSaveLearning');
    btn.disabled = true; btn.innerText = "Đang lưu...";
    const isEdit = !!currentEditLearningId;
    const id = isEdit ? currentEditLearningId : 'learn_' + Date.now();
    const rawNgay = document.getElementById('learning_ngay').value;
    const newData = {
        id: id, ngay: formatDateForSheet(rawNgay),
        truong: document.getElementById('learning_truong').value,
        noi_dung: document.getElementById('learning_noi_dung').value,
        ghi_chu: document.getElementById('learning_ghi_chu').value,
        mota: document.getElementById('learning_mota').value,
        link: document.getElementById('learning_link').value,
        link_anh: document.getElementById('learning_link_anh').value,
        anh: document.getElementById('learning_anh').value,
        file: document.getElementById('learning_file').value,
        link_video: document.getElementById('learning_link_video').value,
        video: document.getElementById('learning_video').value
    };
    const columns = ['id', 'ngay', 'truong', 'noi_dung', 'ghi_chu', 'mota', 'link', 'link_anh', 'anh', 'file', 'link_video', 'video'];
    if (isEdit) {
        await updateInSheet(CONFIG.learningSheetName, id, newData, columns, true);
        const idx = learningData.findIndex(x => x.id === id);
        if (idx !== -1) learningData[idx] = newData;
    } else {
        await appendToSheet(CONFIG.learningSheetName, newData, columns, true);
        learningData.unshift(newData);
    }
    currentEditLearningId = null; renderLearning(); closeModal('learningModal');
    btn.disabled = false; btn.innerText = "Lưu bài học";
}

function editLearning(id) {
    const l = learningData.find(x => x.id === id);
    if (!l) return;
    currentEditLearningId = id;
    document.getElementById('learning_ngay').value = formatDateForInput(l.ngay || '');
    document.getElementById('learning_truong').value = l.truong || '';
    document.getElementById('learning_noi_dung').value = l.noi_dung || '';
    document.getElementById('learning_ghi_chu').value = l.ghi_chu || '';
    document.getElementById('learning_mota').value = l.mota || '';
    document.getElementById('learning_link').value = l.link || '';
    document.getElementById('learning_link_anh').value = l.link_anh || '';
    document.getElementById('learning_anh').value = l.anh || '';
    document.getElementById('learning_file').value = l.file || '';
    document.getElementById('learning_link_video').value = l.link_video || '';
    document.getElementById('learning_video').value = l.video || '';
    ['learning_noi_dung', 'learning_ghi_chu', 'learning_mota'].forEach(tid => {
        const el = document.getElementById(tid);
        if (el) { el.style.height = ''; el.style.height = el.scrollHeight + 'px'; }
    });
    document.getElementById('learningModalOverlay').classList.add('open');
    document.getElementById('learningModal').classList.add('open');
    updateRelatedLearning(l.id, l.truong);
}

function updateRelatedLearning(id, tagsStr) {
    const section = document.getElementById('learning_related_section');
    const list = document.getElementById('learning_related_list');
    const countLabel = document.getElementById('learning_related_count');
    if (!tagsStr || !section || !list) return;
    const tags = tagsStr.split(',').map(t => t.trim().toLowerCase()).filter(x => x);
    if (tags.length === 0) { section.classList.add('hidden'); return; }
    const related = learningData.filter(l => {
        if (l.id === id) return false;
        const lTags = (l.truong || '').toLowerCase().split(',').map(t => t.trim());
        return tags.some(t => lTags.includes(t));
    }).slice(0, 3);
    if (related.length === 0) { section.classList.add('hidden'); } else {
        section.classList.remove('hidden'); countLabel.innerText = related.length;
        list.innerHTML = related.map(l => `<div onclick="editLearning('${l.id}')" class="p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:border-primary/30 hover:bg-blue-50/50 transition-all"><div class="text-[10px] font-bold text-primary mb-1 truncate">${l.truong}</div><div class="text-xs font-bold text-slate-800 line-clamp-1">${l.noi_dung || '---'}</div><div class="text-[10px] text-slate-500 mt-1">${l.ngay}</div></div>`).join('');
    }
}

async function deleteLearning(id) {
    if (confirm('Xóa bài học?')) {
        await deleteFromSheet(CONFIG.learningSheetName, id);
        learningData = learningData.filter(x => x.id !== id);
        renderLearning();
    }
}

let currentFlashcards = [];
let flashIndex = 0;
function startFlashcards() {
    if (learningData.length === 0) { alert("Chưa có bài học nào!"); return; }
    currentFlashcards = [...learningData].sort(() => Math.random() - 0.5);
    flashIndex = 0; showFlashcardModal(); displayFlashcard();
}
function showFlashcardModal() {
    const overlay = document.getElementById('flashcardModalOverlay');
    const modal = document.getElementById('flashcardModal');
    overlay.classList.remove('hidden'); modal.classList.remove('hidden');
    setTimeout(() => { overlay.classList.add('opacity-100'); modal.classList.add('opacity-100', 'scale-100'); modal.classList.remove('scale-95', 'opacity-0'); }, 10);
}
function closeFlashcards() {
    const overlay = document.getElementById('flashcardModalOverlay');
    const modal = document.getElementById('flashcardModal');
    overlay.classList.remove('opacity-100'); modal.classList.add('scale-95', 'opacity-0'); modal.classList.remove('scale-100', 'opacity-100');
    setTimeout(() => { overlay.classList.add('hidden'); modal.classList.add('hidden'); }, 300);
}
function displayFlashcard() {
    const item = currentFlashcards[flashIndex]; if (!item) return;
    const card = document.getElementById('flashcardElement'); card.classList.remove('flipped');
    setTimeout(() => {
        document.getElementById('flashcard-front-content').innerText = item.noi_dung || item.truong || "Không có tiêu đề";
        document.getElementById('flashcard-back-content').innerHTML = `<div class="font-bold text-primary mb-2">${item.truong || ''}</div><div class="mb-3">${item.ghi_chu || ''}</div><div class="text-[10px] text-slate-400 border-t pt-2">${item.mota || ''}</div>`;
    }, 150);
}
function nextFlashcard() {
    flashIndex++;
    if (flashIndex >= currentFlashcards.length) {
        if (confirm("Hoàn thành vòng ôn tập! Tiếp tục mới?")) startFlashcards();
        else closeFlashcards();
        return;
    }
    displayFlashcard();
}

function toggleLearningTag(tag) {
    const input = document.getElementById('learning_truong');
    let vals = input.value.split(',').map(x => x.trim()).filter(x => x);
    if (vals.includes(tag)) vals = vals.filter(x => x !== tag);
    else vals.push(tag);
    input.value = vals.join(', ');
}

// UI Helpers
function openNoteModal() {
    currentEditNoteId = null;
    document.getElementById('notePanel').classList.add('open');
    document.getElementById('notePanelOverlay').classList.add('open');
    setNoteDefaults();
}
function closeModal(id) {
    if (id === 'notePanel') {
        document.getElementById('notePanel').classList.remove('open');
        document.getElementById('notePanelOverlay').classList.remove('open');
    } else if (id === 'expenseModal') {
        document.getElementById('expenseModal').classList.remove('open');
        document.getElementById('expenseModalOverlay').classList.remove('open');
    } else if (id === 'learningModal') {
        document.getElementById('learningModal').classList.remove('open');
        document.getElementById('learningModalOverlay').classList.remove('open');
    } else {
        document.getElementById(id).classList.add('hidden');
    }
}

function setNoteDefaults() {
    const now = new Date();
    const localNow = localISO(now);
    const localOut = localISO(new Date(now.getTime() + 30 * 60000));

    document.getElementById('note_ngay').value = formatLocalDate(now);
    document.getElementById('note_ngay_in').value = localNow;
    document.getElementById('note_ngay_out').value = localOut;
    document.getElementById('note_id_ghi_chu').value = 'note_' + Date.now();
    setTruong('Ghi chú');

    if (currentUser) {
        const doiTuongSelect = document.getElementById('note_doi_tuong');
        if (doiTuongSelect) {
            const nameToMatch = currentUser.name;
            for (let opt of doiTuongSelect.options) {
                if (opt.value === nameToMatch || opt.value === currentUser.id) {
                    doiTuongSelect.value = opt.value;
                    break;
                }
            }
        }
    }
}

function syncDateFromIn() {
    syncTimeRange('note_ngay_in', 'note_ngay', 'note_ngay_out');
}

function syncAddNoteDateTimes() {
    syncTimeRange('add_note_ngay_in', 'add_note_ngay', 'add_note_ngay_out');
}

function setTruong(val) {
    document.getElementById('note_truong').value = val;
    document.querySelectorAll('#note_truong_buttons .truong-btn').forEach(btn => {
        if (btn.innerText === val) {
            btn.classList.add('border-primary', 'bg-blue-50', 'text-primary');
            btn.classList.remove('border-slate-100', 'bg-slate-50', 'text-slate-600');
        } else {
            btn.classList.remove('border-primary', 'bg-blue-50', 'text-primary');
            btn.classList.add('border-slate-100', 'bg-slate-50', 'text-slate-600');
        }
    });
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            document.getElementById('note_dia_chi').value = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
        }, err => alert("Không thể lấy vị trí: " + err.message));
    } else alert("Trình duyệt không hỗ trợ Geolocation");
}

async function handleImgBBUpload(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const formData = new FormData();
    formData.append('image', file);

    const btn = document.getElementById('btnSaveNote');
    btn.disabled = true;
    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${CONFIG.imgbbApiKey}`, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
            document.getElementById('note_linh_anh').value = data.data.url;
            document.getElementById('note_anh').value = data.data.title;
        } else alert("Upload thất bại!");
    } catch (err) { alert("Lỗi upload: " + err.message); }
    finally { btn.disabled = false; }
}

function toggleSidebarMobile() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('opacity-100'), 10);
    } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.remove('opacity-100');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

function setExpenseThuChi(val) {
    document.getElementById('expense_thu_chi').value = val;
    document.querySelectorAll('#expense_thu_chi_buttons button').forEach(btn => {
        if (btn.innerText.includes(val)) {
            btn.classList.add('border-primary', 'bg-blue-50', 'text-primary');
            btn.classList.remove('border-slate-200', 'bg-white', 'text-slate-700', 'hover:bg-slate-50');
        } else {
            btn.classList.remove('border-primary', 'bg-blue-50', 'text-primary');
            btn.classList.add('border-slate-200', 'bg-white', 'text-slate-700', 'hover:bg-slate-50');
        }
    });

    // Logic ẩn/hiện tài khoản
    const groupChi = document.getElementById('expense_tk_chi_group');
    const groupThu = document.getElementById('expense_tk_thu_group');
    if (val === 'THU') {
        groupChi.classList.add('hidden');
        groupThu.classList.remove('hidden');
        document.getElementById('expense_tk_chi').value = '';
    } else if (val === 'CHI') {
        groupChi.classList.remove('hidden');
        groupThu.classList.add('hidden');
        document.getElementById('expense_tk_thu').value = '';
    } else {
        groupChi.classList.remove('hidden');
        groupThu.classList.remove('hidden');
    }
}

// Converts a Date object to 'YYYY-MM-DDTHH:mm' in LOCAL timezone (no UTC shift)
function localISO(date) {
    const y = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${mo}-${d}T${h}:${m}`;
}

function normalizeDateTimeLocal(value) {
    if (!value) return '';
    const raw = String(value).trim();
    const parseTime = (parts, fallback = '00:00') => {
        if (!parts.length) return fallback;
        const timeMatch = parts[0].match(/^(\d{1,2})(?::(\d{1,2}))?/);
        if (!timeMatch) return fallback;
        let hour = parseInt(timeMatch[1], 10);
        const minute = (timeMatch[2] || '00').padStart(2, '0');
        const marker = (parts[1] || '').toUpperCase();
        if (['SA', 'AM'].includes(marker) && hour === 12) hour = 0;
        if (['CH', 'PM'].includes(marker) && hour < 12) hour += 12;
        if (hour > 23) return fallback;
        return `${String(hour).padStart(2, '0')}:${minute}`;
    };

    // Nếu đã đúng định dạng YYYY-MM-DD (có thể chứa T hoặc khoảng trắng)
    if (raw.includes('-') && raw.split('-')[0].length === 4) {
        const parts = raw.replace('T', ' ').split(/\s+/);
        const datePart = parts[0];
        return `${datePart}T${parseTime(parts.slice(1))}`;
    }
    // Nếu là định dạng DD/MM/YYYY (từ Google Sheets)
    if (raw.includes('/')) {
        const parts = raw.split(/\s+/);
        const datePart = parts[0];
        const dParts = datePart.split('/');
        if (dParts.length === 3) {
            // Chuyển sang YYYY-MM-DD
            const isoDate = `${dParts[2]}-${dParts[1].padStart(2, '0')}-${dParts[0].padStart(2, '0')}`;
            return `${isoDate}T${parseTime(parts.slice(1))}`;
        }
    }
    return raw.replace(' ', 'T').slice(0, 16);
}

function formatDateForSheet(dStr) {
    if (!dStr) return '';
    if (dStr.includes('-')) {
        const parts = dStr.split('-');
        if (parts.length === 3 && parts[0].length === 4) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
    }
    return dStr;
}

function formatDateTimeForSheet(dtStr) {
    if (!dtStr) return '';
    const normalized = dtStr.replace(' ', 'T');
    const parts = normalized.split('T');
    const datePart = formatDateForSheet(parts[0]);
    const timePart = parts[1] ? parts[1].slice(0, 5) : '';
    return timePart ? `${datePart} ${timePart}` : datePart;
}

function formatDateForInput(dStr) {
    if (!dStr) return '';
    // If already YYYY-MM-DD
    if (dStr.includes('-') && dStr.split('-')[0].length === 4) return dStr.split(' ')[0];
    // If DD/MM/YYYY
    if (dStr.includes('/')) {
        const parts = dStr.split(' ')[0].split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
    }
    return dStr.split(' ')[0];
}

function formatLocalDate(date) {
    return localISO(date).split('T')[0];
}

function getTimePart(value) {
    const normalized = normalizeDateTimeLocal(value);
    return normalized ? (normalized.split('T')[1] || '') : '';
}

function syncTimeRange(startInputId, dateInputId, endInputId) {
    const startEl = document.getElementById(startInputId);
    if (!startEl || !startEl.value) return;

    const startDate = new Date(startEl.value);
    if (isNaN(startDate)) return;

    const dateEl = dateInputId ? document.getElementById(dateInputId) : null;
    const endEl = endInputId ? document.getElementById(endInputId) : null;

    if (dateEl && dateEl.value !== formatLocalDate(startDate)) {
        dateEl.value = formatLocalDate(startDate);
    }
    if (endEl) {
        // Determine if we should overwrite the end date
        let shouldOverWrite = true;
        if (endEl.value) {
            const currentEndDate = new Date(endEl.value);
            // If current end date is valid and strictly AFTER the new start date, keep it
            if (!isNaN(currentEndDate) && currentEndDate > startDate) {
                shouldOverWrite = false;
            }
        }

        // Only automatically shift the end date if it was invalid or before the start date
        if (shouldOverWrite) {
            endEl.value = localISO(new Date(startDate.getTime() + 30 * 60000));
        }
    }
}

function get24HNow() {
    const now = new Date();
    return { date: localISO(now).split('T')[0], full: localISO(now) };
}

function openExpenseModal(dateValue = null) {
    currentEditExpenseId = null;
    document.getElementById('expenseModalOverlay').classList.add('open');
    document.getElementById('expenseModal').classList.add('open');
    const now = new Date();
    const timePart = localISO(now).split('T')[1];
    document.getElementById('expense_ngay').value = dateValue || localISO(now).split('T')[0];
    document.getElementById('expense_ngay_h').value = dateValue ? `${dateValue}T${timePart}` : localISO(now);
    document.getElementById('expense_danh_muc').value = '';
    document.getElementById('expense_chi_tiet').value = '';
    document.getElementById('expense_tk_chi').value = '';
    document.getElementById('expense_tk_thu').value = '';
    document.getElementById('expense_so_tien').value = '';
    setExpenseThuChi('CHI');
}
function openLearningModal(dateValue = null) {
    currentEditLearningId = null;
    document.getElementById('learningModalOverlay').classList.add('open');
    document.getElementById('learningModal').classList.add('open');
    const now = new Date();
    document.getElementById('learning_ngay').value = dateValue || localISO(now).split('T')[0];
    document.getElementById('learning_truong').value = '';
    document.getElementById('learning_noi_dung').value = '';
    document.getElementById('learning_ghi_chu').value = '';
    document.getElementById('learning_mota').value = '';
    document.getElementById('learning_link').value = '';
    ['learning_noi_dung', 'learning_ghi_chu', 'learning_mota'].forEach(id => {
        const el = document.getElementById(id);
        el.style.height = 'auto';
    });

    const uniqueTruong = [...new Set(learningData.flatMap(l => (l.truong || '').split(',').map(t => t.trim()).filter(x => x)))];
    const tagsContainer = document.getElementById('learning_truong_tags');
    if (tagsContainer) {
        tagsContainer.innerHTML = uniqueTruong.map(t => `<button type="button" onclick="toggleLearningTag('${t}')" class="px-3 py-1 bg-slate-100 hover:bg-primary/20 hover:text-primary rounded-full text-xs font-semibold text-slate-600 transition-colors">${t}</button>`).join('');
    }
}

// --- LOGIC FOR QUICK ADD MODULE ---
function fetchAddGeo() {
    const btn = event.currentTarget; btn.innerText = '...';
    navigator.geolocation.getCurrentPosition(
        (pos) => { document.getElementById('add_note_dia_chi').value = pos.coords.latitude + ', ' + pos.coords.longitude; btn.innerText = '📍'; },
        (err) => { alert('Lỗi định vị'); btn.innerText = '📍'; }
    );
}
function setAddNoteTruong(val) {
    document.getElementById('add_note_truong').value = val;
    document.querySelectorAll('#add_note_truong_buttons button').forEach(btn => {
        if (btn.innerText === val) {
            btn.className = 'px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-white shadow-sm transition-all';
        } else {
            btn.className = 'px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all';
        }
    });
}
// Helper to adjust date by days
// Helper to adjust date by days
function adjustDate(inputId, delta) {
    const el = document.getElementById(inputId);
    if (!el || !el.value) return;
    const d = new Date(el.value);
    d.setDate(d.getDate() + delta);
    el.value = formatLocalDate(d);

    // Trigger sync for all related datetime-local fields
    syncDateToRelatedFields(inputId);

    // Physical trigger for onchange to ensure filters update instantly
    if (el.onchange) {
        el.onchange();
    } else {
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

// Logic đồng bộ từ ô "Ngày" (date) sang các ô "Ngày giờ" (datetime-local)
function syncDateToRelatedFields(inputId) {
    const dateValue = document.getElementById(inputId).value;
    if (!dateValue) return;

    // Định nghĩa bản đồ các trường liên quan
    const relationMap = {
        'add_note_ngay': ['add_note_ngay_in', 'add_note_ngay_out'],
        'note_ngay': ['note_ngay_in', 'note_ngay_out'],
        'add_expense_ngay': ['add_expense_ngay_h'],
        'expense_ngay': ['expense_ngay_h'],
        'dd_ngay': ['dd_ngay_h'],
        'add_learning_ngay': [] // Không có trường datetime-local liên quan
    };

    const targets = relationMap[inputId] || [];

    // Nếu không nằm trong map, thử tìm theo quy tắc _h (ví dụ abc_ngay -> abc_ngay_h)
    if (targets.length === 0 && document.getElementById(inputId + '_h')) {
        targets.push(inputId + '_h');
    }

    targets.forEach(targetId => {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            const currentTimePart = targetEl.value.split('T')[1] || "08:00";
            targetEl.value = dateValue + 'T' + currentTimePart;

            // Đặc biệt cho Ghi chú: nếu đổi Ngày in thì có thể cần đồng bộ Ngày out
            if (targetId === 'add_note_ngay_in') syncAddNoteDateTimes();
            if (targetId === 'note_ngay_in') syncDateFromIn();
        }
    });
}

// Live Clock: auto-update un-edited time fields every 30s
let lastAutoStr = "";
setInterval(() => {
    if (currentModule !== 'add') return;
    const nowISO = localISO(new Date());
    const expenseH = document.getElementById('add_expense_ngay_h');
    const noteH = document.getElementById('add_note_ngay_in');
    if (expenseH && (!expenseH.value || expenseH.value === lastAutoStr)) expenseH.value = nowISO;
    if (noteH && (!noteH.value || noteH.value === lastAutoStr)) {
        noteH.value = nowISO;
        syncAddNoteDateTimes();
    }
    lastAutoStr = nowISO;
}, 30000);

function setAddExpenseThuChi(val) {
    document.getElementById('add_expense_thu_chi').value = val;
    document.querySelectorAll('#add_expense_thu_chi_buttons button').forEach(btn => {
        if (btn.innerText.includes(val)) {
            btn.classList.add('border-primary', 'bg-blue-50', 'text-primary');
            btn.classList.remove('border-slate-200', 'bg-white', 'text-slate-700');
        } else {
            btn.classList.remove('border-primary', 'bg-blue-50', 'text-primary');
            btn.classList.add('border-slate-200', 'bg-white', 'text-slate-700');
        }
    });

    // Logic ẩn/hiện tài khoản
    const groupChi = document.getElementById('add_expense_tk_chi_group');
    const groupThu = document.getElementById('add_expense_tk_thu_group');
    if (val === 'THU') {
        groupChi.classList.add('hidden');
        groupThu.classList.remove('hidden');
        document.getElementById('add_expense_tk_chi').value = '';
    } else if (val === 'CHI') {
        groupChi.classList.remove('hidden');
        groupThu.classList.add('hidden');
        document.getElementById('add_expense_tk_thu').value = '';
    } else {
        groupChi.classList.remove('hidden');
        groupThu.classList.remove('hidden');
    }
}
function setAddExpenseTkChi(val) {
    document.getElementById('add_expense_tk_chi').value = val;
    document.querySelectorAll('#add_expense_tk_chi_buttons button').forEach(btn => {
        if (btn.innerText.trim() === val) {
            btn.classList.add('bg-primary', 'text-white', 'border-primary');
            btn.classList.remove('bg-slate-100', 'text-slate-600', 'border-slate-200');
        } else {
            btn.classList.remove('bg-primary', 'text-white', 'border-primary');
            btn.classList.add('bg-slate-100', 'text-slate-600', 'border-slate-200');
        }
    });
}
function setAddExpenseTkThu(val) {
    document.getElementById('add_expense_tk_thu').value = val;
    document.querySelectorAll('#add_expense_tk_thu_buttons button').forEach(btn => {
        if (btn.innerText.trim() === val) {
            btn.classList.add('bg-primary', 'text-white', 'border-primary');
            btn.classList.remove('bg-slate-100', 'text-slate-600', 'border-slate-200');
        } else {
            btn.classList.remove('bg-primary', 'text-white', 'border-primary');
            btn.classList.add('bg-slate-100', 'text-slate-600', 'border-slate-200');
        }
    });
}

function toggleAddLearningTag(tag) {
    const input = document.getElementById('add_learning_truong');

    let vals = input.value.split(',').map(x => x.trim()).filter(x => x);
    if (vals.includes(tag)) vals = vals.filter(x => x !== tag);
    else vals.push(tag);
    input.value = vals.join(', ');
}
function initQuickAddForm() {
    try {
        const now = new Date();
        const out = new Date(now.getTime() + 30 * 60000);
        const nowISO = localISO(now);
        const outISO = localISO(out);
        const dateStr = nowISO.split('T')[0];

        ['note', 'expense', 'learning'].forEach(mod => {
            const el = document.getElementById(`add_${mod}_ngay`);
            if (el) el.value = dateStr;
        });
        if (document.getElementById('add_note_ngay_in')) document.getElementById('add_note_ngay_in').value = nowISO;
        if (document.getElementById('add_note_ngay_out')) document.getElementById('add_note_ngay_out').value = outISO;
        if (document.getElementById('add_expense_ngay_h')) document.getElementById('add_expense_ngay_h').value = nowISO;

        if (typeof setAddExpenseThuChi === 'function') setAddExpenseThuChi('CHI');

        const tagsContainer = document.getElementById('add_learning_truong_tags');
        if (tagsContainer) {
            const uniqueTruong = [...new Set(learningData.flatMap(l => (l.truong || '').split(',').map(t => t.trim()).filter(x => x)))];
            tagsContainer.innerHTML = uniqueTruong.map(t => `<button type="button" onclick="toggleAddLearningTag('${t}')" class="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600">${t}</button>`).join('');
        }

        const masterNoteDoiTuong = document.getElementById('note_doi_tuong');
        const addNoteDoiTuong = document.getElementById('add_note_doi_tuong');
        if (masterNoteDoiTuong && addNoteDoiTuong) {
            addNoteDoiTuong.innerHTML = masterNoteDoiTuong.innerHTML;
        }

        const masterNoteIdPrev = document.getElementById('note_id_ghi_chu_prev');
        const addNoteIdPrev = document.getElementById('add_note_id_ghi_chu_prev');
        if (masterNoteIdPrev && addNoteIdPrev) {
            addNoteIdPrev.innerHTML = masterNoteIdPrev.innerHTML;
        }

        if (currentUser && addNoteDoiTuong) {
            const nameToMatch = currentUser.name;
            for (let opt of addNoteDoiTuong.options) {
                if (opt.value === nameToMatch || opt.value === currentUser.id) {
                    addNoteDoiTuong.value = opt.value;
                    break;
                }
            }
        }

        // Auto resize textareas
        setTimeout(() => {
            ['add_note_ghi_chu', 'add_note_noi_dung', 'add_learning_noi_dung', 'add_learning_ghi_chu', 'add_learning_mota'].forEach(id => {
                const el = document.getElementById(id);
                if (el) { el.style.height = ''; el.style.height = el.scrollHeight + 'px'; }
            });
        }, 100);
    } catch (err) {
        console.warn("initQuickAddForm error non-critical:", err);
    }
}
async function saveAddNote() {
    const btn = document.getElementById('btnSaveAddNote'); btn.disabled = true; btn.innerText = "Đang lưu...";
    const id = 'note_' + Date.now();
    const rawNgay = document.getElementById('add_note_ngay').value;
    const newData = {
        id: id,
        ngay: formatDateForSheet(rawNgay),
        ngay_in: formatDateTimeForSheet(document.getElementById('add_note_ngay_in').value),
        ngay_out: formatDateTimeForSheet(document.getElementById('add_note_ngay_out').value),
        truong: document.getElementById('add_note_truong').value,
        ghi_chu: document.getElementById('add_note_ghi_chu').value,
        noi_dung: document.getElementById('add_note_noi_dung').value,
        doi_tuong: document.getElementById('add_note_doi_tuong').value,
        dia_chi: document.getElementById('add_note_dia_chi').value,
        loai: '', id_gc: '',
        linh_anh: document.getElementById('add_note_linh_anh').value,
        link: document.getElementById('add_note_link').value,
        anh: document.getElementById('add_note_anh').value, file: '', video: '',
        nam_thang: rawNgay.substring(0, 7).replace('-', '/')
    };
    await appendToSheet(CONFIG.noteSheetName, newData, [], false);
    notesData.unshift(newData); renderNotes();
    ['add_note_ghi_chu', 'add_note_noi_dung', 'add_note_dia_chi', 'add_note_linh_anh', 'add_note_link'].forEach(id => document.getElementById(id).value = '');
    btn.disabled = false; btn.innerText = "Lưu";
}
async function saveAddExpense() {
    const btn = document.getElementById('btnSaveAddExpense');
    btn.disabled = true; btn.innerText = "Đang lưu...";

    const id = 'exp_' + Date.now();
    const thu_chi = document.getElementById('add_expense_thu_chi').value;
    const soTien = parseFloat(document.getElementById('add_expense_so_tien').value) || 0;
    const rawNgay = document.getElementById('add_expense_ngay').value;
    const newData = {
        id: id,
        ngay: formatDateForSheet(rawNgay),
        ngay_h: formatDateTimeForSheet(document.getElementById('add_expense_ngay_h').value),
        thu_chi: thu_chi,
        danh_muc: document.getElementById('add_expense_danh_muc').value,
        chi_tiet: document.getElementById('add_expense_chi_tiet').value,
        tk_chi: document.getElementById('add_expense_tk_chi').value,
        tk_thu: document.getElementById('add_expense_tk_thu').value,
        so_tien: soTien,
        so_tien_am: thu_chi === 'THU' ? -soTien : soTien,
        nam_thang: rawNgay.substring(0, 7).replace('-', '/'),
        tien_danh_muc: soTien + '_' + document.getElementById('add_expense_danh_muc').value,
        tk_thu_chi: document.getElementById('add_expense_tk_thu').value + '_' + document.getElementById('add_expense_tk_chi').value
    };

    const cols = []; // Use header matching (exactOrder = false)

    try {
        await appendToSheet(CONFIG.expenseSheetName, newData, cols, false);
        expensesData.unshift(newData);

        // Reset form
        btn.innerText = "Lưu";
        ['add_expense_danh_muc', 'add_expense_chi_tiet', 'add_expense_tk_chi', 'add_expense_tk_thu', 'add_expense_so_tien'].forEach(id => document.getElementById(id).value = '');

        // Refresh views
        if (typeof renderExpenses === 'function') renderExpenses();
        if (currentModule === 'dashboard') renderExpenseDashboard();
    } catch (err) {
        alert("Lỗi khi lưu dữ liệu: " + err.message);
        btn.innerText = "Lưu";
    } finally {
        btn.disabled = false;
    }
}
async function saveAddLearning() {
    const btn = document.getElementById('btnSaveAddLearning'); btn.disabled = true; btn.innerText = "Đang lưu...";
    const id = 'learn_' + Date.now();
    const rawNgay = document.getElementById('add_learning_ngay').value;
    const newData = {
        id: id,
        ngay: formatDateForSheet(rawNgay),
        truong: document.getElementById('add_learning_truong').value,
        noi_dung: document.getElementById('add_learning_noi_dung').value,
        ghi_chu: document.getElementById('add_learning_ghi_chu').value,
        mota: document.getElementById('add_learning_mota').value,
        link: document.getElementById('add_learning_link').value,
        link_anh: document.getElementById('add_learning_link_anh').value,
        link_video: document.getElementById('add_learning_link_video').value,
        anh: '', file: '', video: ''
    };
    await appendToSheet(CONFIG.learningSheetName, newData, [], false);
    learningData.unshift(newData); renderLearning();
    ['add_learning_truong', 'add_learning_noi_dung', 'add_learning_ghi_chu', 'add_learning_mota', 'add_learning_link', 'add_learning_link_anh', 'add_learning_link_video'].forEach(id => document.getElementById(id).value = '');
    btn.disabled = false; btn.innerText = "Lưu";
}

// --- DASHBOARD LOGIC ---
let dashboardCharts = { category: null, trend: null, monthly: null };

function parseMoneyValue(value) {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return value;

    let cleaned = String(value).trim().replace(/[^\d,.-]/g, '');
    const isNegative = cleaned.includes('-');
    cleaned = cleaned.replace(/-/g, '');

    const separators = cleaned.match(/[,.]/g) || [];
    if (separators.length > 0) {
        const lastSeparator = Math.max(cleaned.lastIndexOf(','), cleaned.lastIndexOf('.'));
        const digitsAfter = cleaned.length - lastSeparator - 1;
        const isLikelyDecimal = separators.length === 1 && digitsAfter > 0 && digitsAfter <= 2;

        cleaned = isLikelyDecimal
            ? cleaned.replace(',', '.')
            : cleaned.replace(/[,.]/g, '');
    }

    const parsed = parseFloat(cleaned);
    const signed = isNegative ? -parsed : parsed;
    return Number.isFinite(signed) ? signed : 0;
}

function getExpenseRemainingValue(row, key, fallback) {
    const raw = row[key];
    if (raw !== undefined && raw !== null && raw !== '') return parseMoneyValue(raw);
    return fallback;
}

function formatRemainingValue(value) {
    return value === null || value === undefined ? '-' : parseMoneyValue(value).toLocaleString();
}

function populateDashboardFilters() {
    if (!expensesData || expensesData.length === 0) return;
    const months = [...new Set(expensesData.map(e => e.nam_thang))].filter(m => m).sort().reverse();
    const categories = [...new Set(expensesData.map(e => e.danh_muc))].filter(c => c).sort();
    const accounts = [...new Set([...expensesData.map(e => e.tk_chi), ...expensesData.map(e => e.tk_thu)])].filter(a => a).sort();

    const monthSelect = document.getElementById('dash-filter-month');
    const catSelect = document.getElementById('dash-filter-category');
    const accSelect = document.getElementById('dash-filter-account');

    const currM = monthSelect.value;
    const currC = catSelect.value;
    const currA = accSelect.value;

    monthSelect.innerHTML = '<option value="">Tất cả</option>' + months.map(m => `<option value="${m}">${m}</option>`).join('');
    catSelect.innerHTML = '<option value="">Tất cả</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
    accSelect.innerHTML = '<option value="">Tất cả</option>' + accounts.map(a => `<option value="${a}">${a}</option>`).join('');

    // Default to current month only on first render
    if (monthSelect.getAttribute('data-init') !== 'true' && months.length > 0) {
        const now = new Date();
        const curM = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
        if (months.includes(curM)) {
            monthSelect.value = curM;
        }
        monthSelect.setAttribute('data-init', 'true');
    } else {
        monthSelect.value = currM;
    }
    catSelect.value = currC;
    accSelect.value = currA;
}

function renderExpenseDashboard() {
    if (!expensesData || expensesData.length === 0) return;
    populateDashboardFilters();

    const fMonth = document.getElementById('dash-filter-month').value;
    const fCat = document.getElementById('dash-filter-category').value;
    const fType = document.getElementById('dash-filter-type').value;
    const fAcc = document.getElementById('dash-filter-account').value;
    const fSearch = (document.getElementById('dash-filter-search')?.value || "").toLowerCase().trim();

    let globalThu = 0;
    let globalChi = 0;
    let filteredThu = 0;
    let filteredChi = 0;

    let categoryMap = {};
    let monthlyDataValue = {};
    let accountMap = {};
    let detailedList = [];

    // 0. Pre-calculate running balances for ALL accounts chronologically
    const balanceMap = {};
    const parseSortDate = (dStr) => {
        if (!dStr) return 0;
        // Format YYYY-MM-DD HH:mm or YYYY-MM-DD
        if (dStr.includes('-')) {
            const parts = dStr.split(' ');
            const dateParts = parts[0].split('-'); // [Y, M, D]
            const timePart = parts[1] || '00:00';
            return new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}T${timePart}`).getTime();
        }
        // Format DD/MM/YYYY HH:mm or DD/MM/YYYY
        if (dStr.includes('/')) {
            const parts = dStr.split(' ');
            const dateParts = parts[0].split('/'); // [D, M, Y]
            const timePart = parts[1] || '00:00';
            return new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timePart}`).getTime();
        }
        const finalTs = new Date(dStr).getTime();
        return isNaN(finalTs) ? 0 : finalTs;
    };

    // Sort full data by date + time for correct balance calculation (ASC)
    const sortedForCalc = [...expensesData].sort((a, b) => {
        const sA = parseSortDate(a.ngay_h || a.ngay);
        const sB = parseSortDate(b.ngay_h || b.ngay);
        if (sA !== sB) return sA - sB;
        // Stable sort by ID for same time
        return (a.id > b.id) ? 1 : -1;
    });

    sortedForCalc.forEach(e => {
        const amount = parseMoneyValue(e.so_tien);
        if (e.tk_chi) {
            balanceMap[e.tk_chi] = (balanceMap[e.tk_chi] || 0) - amount;
            e._bal1 = balanceMap[e.tk_chi];
        } else e._bal1 = null;

        if (e.tk_thu) {
            balanceMap[e.tk_thu] = (balanceMap[e.tk_thu] || 0) + amount;
            e._bal2 = balanceMap[e.tk_thu];
        } else e._bal2 = null;
    });

    expensesData.forEach(e => {
        const amount = parseMoneyValue(e.so_tien);
        const type = (e.thu_chi || "").toUpperCase();
        const category = e.danh_muc || "Khác";
        const tkChi = e.tk_chi || "";
        const tkThu = e.tk_thu || "";
        const note = e.ghi_chu || "";

        let dateISO = "";
        let dateDisp = e.ngay || "";
        if (e.ngay) {
            const d = new Date(e.ngay.includes('/') ? e.ngay.split('/').reverse().join('-') : e.ngay);
            if (!isNaN(d)) dateISO = d.toISOString().split('T')[0];
        }

        // Global balance (System remaining)
        if (type === 'THU') globalThu += amount;
        else if (type === 'CHI') globalChi += amount;

        // Filter logic
        let isMatch = true;
        if (fMonth && (!dateISO || !dateISO.startsWith(fMonth.replace('/', '-')))) isMatch = false;
        if (fCat && category !== fCat) isMatch = false;
        if (fType) {
            if (fType === 'THU' && type !== 'THU') isMatch = false;
            else if (fType === 'CHI' && type !== 'CHI') isMatch = false;
            else if (fType === 'TRANSFER' && (!tkChi || !tkThu)) isMatch = false;
        }
        if (fAcc && tkChi !== fAcc && tkThu !== fAcc) isMatch = false;
        if (fSearch && !category.toLowerCase().includes(fSearch) && !note.toLowerCase().includes(fSearch) && !(e.id && e.id.toLowerCase().includes(fSearch))) isMatch = false;

        if (isMatch) {
            if (type === 'THU') filteredThu += amount;
            else if (type === 'CHI') filteredChi += amount;

            if (type === 'CHI') categoryMap[category] = (categoryMap[category] || 0) + amount;

            if (dateISO) {
                const mKey = dateISO.substring(0, 7);
                if (!monthlyDataValue[mKey]) monthlyDataValue[mKey] = { thu: 0, chi: 0 };
                if (type === 'THU') monthlyDataValue[mKey].thu += amount;
                else if (type === 'CHI') monthlyDataValue[mKey].chi += amount;
            }

            // Account Stats (Filtered)
            if (tkChi) {
                if (!accountMap[tkChi]) accountMap[tkChi] = { thu: 0, chi: 0 };
                accountMap[tkChi].chi += amount;
            }
            if (tkThu) {
                if (!accountMap[tkThu]) accountMap[tkThu] = { thu: 0, chi: 0 };
                accountMap[tkThu].thu += amount;
            }

            detailedList.push({
                id: e.id || "",
                date: dateDisp,
                type: type,
                category: category,
                tkChi: tkChi,
                tkThu: tkThu,
                amount: amount,
                note: note,
                sortVal: parseSortDate(e.ngay_h || e.ngay),
                bal1: getExpenseRemainingValue(e, 'con_lai_1', e._bal1),
                bal2: getExpenseRemainingValue(e, 'con_lai_2', e._bal2)
            });
        }
    });

    // Sorting detailed list by date descending (UI view)
    detailedList.sort((a, b) => (b.sortVal || 0) - (a.sortVal || 0) || (b.id > a.id ? 1 : -1));

    // Update UI
    document.getElementById('dash-total-thu').innerText = filteredThu.toLocaleString() + 'đ';
    document.getElementById('dash-total-chi').innerText = filteredChi.toLocaleString() + 'đ';
    document.getElementById('dash-balance').innerText = (filteredThu - filteredChi).toLocaleString() + 'đ';
    document.getElementById('dash-global-balance').innerText = (globalThu - globalChi).toLocaleString() + 'đ';

    // Category Table
    const catHtml = Object.keys(categoryMap).sort((a, b) => categoryMap[b] - categoryMap[a]).map(cat => {
        const val = categoryMap[cat];
        const pct = filteredChi > 0 ? ((val / filteredChi) * 100).toFixed(1) : 0;
        return `
                    <tr class="border-b border-slate-50">
                        <td class="py-2"><span class="font-bold text-slate-700">${cat}</span></td>
                        <td class="text-right text-rose-600 font-bold">${val.toLocaleString()}</td>
                        <td class="text-right text-slate-400 font-mono">${pct}%</td>
                    </tr>
                `;
    }).join('') || '<tr><td colspan="3" class="text-center p-4 text-slate-400 italic">Không có dữ liệu chi tiêu</td></tr>';
    document.getElementById('dash-category-table').innerHTML = catHtml;

    // Account Table (Hiển thị tất cả tài khoản, ưu tiên Top Hoa hồng (Thu) lên đầu)
    const allAccountKeys = Object.keys(balanceMap);
    const accountHtml = allAccountKeys.sort((a, b) => {
        const dataA = accountMap[a] || { thu: 0, chi: 0 };
        const dataB = accountMap[b] || { thu: 0, chi: 0 };
        // Ưu tiên theo Hoa hồng (Thu) của kỳ lọc hiện tại
        if (dataB.thu !== dataA.thu) return dataB.thu - dataA.thu;
        // Nếu bằng thu thì xếp theo số dư hiện tại
        return (balanceMap[b] || 0) - (balanceMap[a] || 0);
    }).map(acc => {
        const data = accountMap[acc] || { thu: 0, chi: 0 };
        const finalBal = balanceMap[acc] || 0;
        return `
                    <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td class="py-2"><span class="font-bold text-slate-700">${acc}</span> ${data.thu > 0 ? '🔥' : ''}</td>
                        <td class="text-right text-emerald-600 font-bold">${data.thu.toLocaleString()}</td>
                        <td class="text-right text-rose-400">${data.chi.toLocaleString()}</td>
                        <td class="text-right font-bold ${finalBal >= 0 ? 'text-blue-600' : 'text-rose-600'}">${finalBal.toLocaleString()}</td>
                    </tr>
                `;
    }).join('') || '<tr><td colspan="4" class="text-center p-4 text-slate-400 italic">Không có tài khoản nào</td></tr>';
    document.getElementById('dash-account-table').innerHTML = accountHtml;

    // Detailed List Table
    document.getElementById('dash-list-count').innerText = `${detailedList.length} giao dịch`;
    const listHtml = detailedList.slice(0, 100).map(item => `
                <tr class="hover:bg-slate-50 border-b border-slate-50 last:border-0 group">
                    <td class="py-2 text-[10px] text-slate-400 font-mono">${item.id}</td>
                    <td class="py-2 text-slate-500 whitespace-nowrap">${item.date}</td>
                    <td><span class="px-2 py-0.5 rounded-full ${item.type === 'THU' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} font-bold">${item.type}</span></td>
                    <td class="font-medium text-slate-700">${item.category}</td>
                    <td class="text-slate-600 italic max-w-[150px] truncate" title="${item.note}">${item.note}</td>
                    <td class="text-xs text-slate-400 font-mono">${item.tkChi || '-'}</td>
                    <td class="text-xs text-slate-400 font-mono">${item.tkThu || '-'}</td>
                    <td class="text-right font-bold ${item.type === 'THU' ? 'text-emerald-600' : 'text-rose-600'}">${item.amount.toLocaleString()}</td>
                    <td class="text-right font-mono text-xs ${parseMoneyValue(item.bal1) < 0 ? 'text-rose-500' : 'text-blue-600'}">${formatRemainingValue(item.bal1)}</td>
                    <td class="text-right font-mono text-xs ${parseMoneyValue(item.bal2) < 0 ? 'text-rose-500' : 'text-emerald-600'}">${formatRemainingValue(item.bal2)}</td>
                    <td class="text-center">
                        <div class="flex justify-center gap-2">
                            <button onclick="editExpenseRecord('${item.id}')" title="Sửa" class="p-1 hover:bg-blue-100 rounded text-blue-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.243 3.757a2.828 2.828 0 114 4L7.5 20H3v-4.5L16.243 3.757z" /></svg></button>
                            <button onclick="deleteExpenseRecord('${item.id}')" title="Xóa" class="p-1 hover:bg-rose-100 rounded text-rose-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="12" class="text-center p-8 text-slate-400 italic">Không tìm thấy giao dịch nào phù hợp với bộ lọc</td></tr>';
    document.getElementById('dash-detail-list').innerHTML = listHtml;

    // Charts
    renderCharts(monthlyDataValue);
}

// --- DASHBOARD DRAWER (SIDE PANEL) CRUD ---
function openDashboardDrawer(id = null) {
    const overlay = document.getElementById('dashDrawerOverlay');
    const drawer = document.getElementById('dashDrawer');
    const title = document.getElementById('dashDrawerTitle');
    const btn = document.getElementById('btnSaveDashDrawer');

    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('opacity-100'), 10);
    drawer.classList.remove('translate-x-full');

    // Set default date/time
    const now = new Date();
    document.getElementById('dd_ngay').value = localISO(now).split('T')[0];
    document.getElementById('dd_ngay_h').value = localISO(now);

    // Accounts buttons
    const accs = [...new Set([...expensesData.map(e => e.tk_chi), ...expensesData.map(e => e.tk_thu)])].filter(a => a).sort();
    const renderAccBtns = (containerId, hiddenId) => {
        document.getElementById(containerId).innerHTML = accs.map(a => `
                    <button onclick="setDDTalk('${hiddenId}', '${a}', this)" class="px-2.5 py-1 text-[10px] bg-slate-50 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-primary transition-all font-medium text-slate-600">${a}</button>
                `).join('');
    };
    renderAccBtns('dd_tk_chi_btns', 'dd_tk_chi');
    renderAccBtns('dd_tk_thu_btns', 'dd_tk_thu');

    if (id) {
        const record = expensesData.find(e => e.id === id);
        if (!record) return;
        currentEditExpenseId = id;
        title.innerHTML = '✏️ Sửa Giao Dịch';
        btn.innerText = 'Cập nhật giao dịch';

        document.getElementById('dd_ngay').value = formatDateForInput(record.ngay || '');
        document.getElementById('dd_ngay_h').value = normalizeDateTimeLocal(record.ngay_h || '');
        document.getElementById('dd_danh_muc').value = record.danh_muc || '';
        document.getElementById('dd_chi_tiet').value = record.chi_tiet || record.ghi_chu || '';
        document.getElementById('dd_so_tien').value = record.so_tien || '';

        setDDThuChi(record.thu_chi || 'CHI');
        setDDTalk('dd_tk_chi', record.tk_chi || '');
        setDDTalk('dd_tk_thu', record.tk_thu || '');
    } else {
        currentEditExpenseId = null;
        title.innerHTML = '✨ Thêm Giao Dịch';
        btn.innerText = 'Lưu giao dịch';
        ['dd_danh_muc', 'dd_chi_tiet', 'dd_so_tien', 'dd_tk_chi', 'dd_tk_thu'].forEach(fid => document.getElementById(fid).value = '');
        setDDThuChi('CHI');
    }
}

function closeDashboardDrawer() {
    const overlay = document.getElementById('dashDrawerOverlay');
    const drawer = document.getElementById('dashDrawer');
    overlay.classList.remove('opacity-100');
    drawer.classList.add('translate-x-full');
    setTimeout(() => overlay.classList.add('hidden'), 300);
}

function setDDThuChi(val) {
    document.getElementById('dd_thu_chi').value = val;
    const btns = document.querySelectorAll('#dd_thu_chi_buttons button');
    btns.forEach(b => {
        b.classList.remove('bg-emerald-50', 'border-emerald-500', 'text-emerald-600', 'bg-rose-50', 'border-rose-500', 'text-rose-600', 'bg-blue-50', 'border-blue-500', 'text-blue-600');
        b.classList.add('border-slate-200', 'text-slate-600');
    });
    const active = Array.from(btns).find(b => b.innerText.includes(val === 'TRANSFER' ? 'ĐỔI TIỀN' : val));
    if (active) {
        active.classList.remove('border-slate-200', 'text-slate-600');
        if (val === 'THU') active.classList.add('bg-emerald-50', 'border-emerald-500', 'text-emerald-600');
        else if (val === 'CHI') active.classList.add('bg-rose-50', 'border-rose-500', 'text-rose-600');
        else if (val === 'TRANSFER') active.classList.add('bg-blue-50', 'border-blue-500', 'text-blue-600');
    }

    // Logic ẩn/hiện tài khoản
    const groupChi = document.getElementById('dd_tk_chi_group');
    const groupThu = document.getElementById('dd_tk_thu_group');
    if (val === 'THU') {
        groupChi.classList.add('hidden');
        groupThu.classList.remove('hidden');
        document.getElementById('dd_tk_chi').value = '';
    } else if (val === 'CHI') {
        groupChi.classList.remove('hidden');
        groupThu.classList.add('hidden');
        document.getElementById('dd_tk_thu').value = '';
    } else {
        groupChi.classList.remove('hidden');
        groupThu.classList.remove('hidden');
    }
}

function setDDTalk(hiddenId, val, btnEl = null) {
    document.getElementById(hiddenId).value = val;
    const containerId = hiddenId + '_btns';
    document.querySelectorAll(`#${containerId} button`).forEach(b => {
        b.classList.remove('bg-blue-50', 'border-primary', 'text-primary');
        b.classList.add('bg-slate-50', 'border-slate-200', 'text-slate-600');
        if (b.innerText === val) {
            b.classList.remove('bg-slate-50', 'border-slate-200', 'text-slate-600');
            b.classList.add('bg-blue-50', 'border-primary', 'text-primary');
        }
    });
}

async function saveDashDrawer() {
    const btn = document.getElementById('btnSaveDD');
    const isEdit = !!currentEditExpenseId;
    btn.disabled = true; btn.innerText = isEdit ? "Đang cập nhật..." : "Đang lưu...";

    const id = isEdit ? currentEditExpenseId : 'exp_' + Date.now();
    let thu_chi = document.getElementById('dd_thu_chi').value;
    const soTien = parseFloat(document.getElementById('dd_so_tien').value) || 0;

    // Map TRANSFER back to ĐỔI TIỀN for storage
    const saveThuChi = thu_chi === 'TRANSFER' ? 'ĐỔI TIỀN' : thu_chi;

    const rawNgay = document.getElementById('dd_ngay').value;
    const newData = {
        id: id,
        ngay: formatDateForSheet(rawNgay),
        ngay_h: formatDateTimeForSheet(document.getElementById('dd_ngay_h').value),
        thu_chi: saveThuChi,
        danh_muc: document.getElementById('dd_danh_muc').value,
        chi_tiet: document.getElementById('dd_chi_tiet').value,
        tk_chi: document.getElementById('dd_tk_chi').value,
        tk_thu: document.getElementById('dd_tk_thu').value,
        so_tien: soTien,
        so_tien_am: saveThuChi === 'THU' ? -soTien : soTien,
        nam_thang: rawNgay.substring(0, 7).replace('-', '/'),
        tien_danh_muc: soTien + '_' + document.getElementById('dd_danh_muc').value,
        tk_thu_chi: document.getElementById('dd_tk_thu').value + '_' + document.getElementById('dd_tk_chi').value
    };

    const cols = ['id', 'ngay', 'ngay_h', 'thu_chi', 'danh_muc', 'chi_tiet', 'tk_chi', 'tk_thu', 'so_tien', 'so_tien_am', 'nam_thang', 'tien_danh_muc', 'tk_thu_chi'];

    try {
        if (isEdit) {
            await updateInSheet(CONFIG.expenseSheetName, id, newData, cols);
            const idx = expensesData.findIndex(e => e.id === id);
            if (idx !== -1) expensesData[idx] = newData;
        } else {
            await appendToSheet(CONFIG.expenseSheetName, newData, cols);
            expensesData.unshift(newData);
        }
        closeDashboardDrawer();
        renderExpenseDashboard();
        if (typeof renderExpenses === 'function') renderExpenses();
    } catch (err) {
        alert("Lỗi: " + err.message);
    } finally {
        btn.disabled = false; btn.innerText = "Lưu giao dịch";
    }
}

// --- DASHBOARD CRUD HELPER FUNCTIONS ---
function editExpenseRecord(id) {
    openDashboardDrawer(id);
}

async function deleteExpenseRecord(id) {
    if (confirm("Bạn có chắc chắn muốn xóa giao dịch này không?")) {
        try {
            await deleteFromSheet(CONFIG.expenseSheetName, id);
            expensesData = expensesData.filter(e => e.id !== id);
            renderExpenseDashboard();
            if (typeof renderExpenses === 'function') renderExpenses();
            alert("Đã xóa giao dịch!");
        } catch (err) {
            alert("Lỗi khi xóa: " + err.message);
        }
    }
}

function renderCharts(monthlyData) {
    // monthly bar only
    const sortedMonths = Object.keys(monthlyData).sort();
    const monLabels = sortedMonths.map(m => m.split('-').reverse().join('/'));
    const monThu = sortedMonths.map(m => monthlyData[m].thu);
    const monChi = sortedMonths.map(m => monthlyData[m].chi);
    if (dashboardCharts.monthly) dashboardCharts.monthly.destroy();
    dashboardCharts.monthly = new Chart(document.getElementById('chart-monthly'), {
        type: 'bar',
        data: {
            labels: monLabels, datasets: [
                { label: 'Thu', data: monThu, backgroundColor: '#10b981', borderRadius: 4 },
                { label: 'Chi', data: monChi, backgroundColor: '#f43f5e', borderRadius: 4 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { callback: v => (v / 1000).toLocaleString() + 'k' } }
            },
            plugins: { legend: { position: 'top', labels: { boxWidth: 12 } } }
        }
    });

    // Cleanup unused charts safely
    if (dashboardCharts.category) { dashboardCharts.category.destroy(); dashboardCharts.category = null; }
    if (dashboardCharts.trend) { dashboardCharts.trend.destroy(); dashboardCharts.trend = null; }
}




function renderDailySummary(resetPage = false) {
    if (resetPage) dailyCurrentPage = 1;

    const notesList = document.getElementById('daily-notes-list');
    const expenseList = document.getElementById('daily-expense-list');
    const learningList = document.getElementById('daily-learning-list');

    const fStart = document.getElementById('daily-filter-start').value;
    const fEnd = document.getElementById('daily-filter-end').value;
    const fSearch = (document.getElementById('daily-filter-search')?.value || "").toLowerCase().trim();

    // --- INSIGHT LOGIC ---
    updateDailyInsights(fStart, fEnd);

    const isDateInRange = (dStr) => {
        if (!fStart && !fEnd) return true;
        const ts = parseSortDateDaily(dStr);
        if (!ts) return false;
        const d = new Date(ts);
        d.setHours(0, 0, 0, 0);
        const dTs = d.getTime();

        if (fStart) {
            const s = new Date(fStart);
            s.setHours(0, 0, 0, 0);
            if (dTs < s.getTime()) return false;
        }
        if (fEnd) {
            const e = new Date(fEnd);
            e.setHours(0, 0, 0, 0);
            if (dTs > e.getTime()) return false;
        }
        return true;
    };

    // 1. Filter and Sort All Datasets
    const filteredNotes = notesData.filter(n => {
        if (!isDateInRange(n.ngay)) return false;
        if (fSearch) {
            const content = `${n.truong} ${n.ghi_chu} ${n.noi_dung} ${n.doi_tuong}`.toLowerCase();
            if (!content.includes(fSearch)) return false;
        }
        return true;
    });
    const sortedNotes = [...filteredNotes].sort((a, b) => parseSortDateDaily(b.ngay_in || b.ngay) - parseSortDateDaily(a.ngay_in || a.ngay));

    const filteredExpenses = expensesData.filter(e => {
        if (!isDateInRange(e.ngay)) return false;
        if (fSearch) {
            const content = `${e.danh_muc} ${e.chi_tiet} ${e.thu_chi}`.toLowerCase();
            if (!content.includes(fSearch)) return false;
        }
        return true;
    });
    const sortedExpenses = [...filteredExpenses].sort((a, b) => parseSortDateDaily(b.ngay_h || b.ngay) - parseSortDateDaily(a.ngay_h || a.ngay));

    const filteredLearning = learningData.filter(l => {
        if (!isDateInRange(l.ngay)) return false;
        if (fSearch) {
            const content = `${l.truong} ${l.noi_dung} ${l.ghi_chu} ${l.mota}`.toLowerCase();
            if (!content.includes(fSearch)) return false;
        }
        return true;
    });
    const sortedLearning = [...filteredLearning].sort((a, b) => parseSortDateDaily(b.ngay) - parseSortDateDaily(a.ngay));

    // 2. Calculate Pagination
    const pageSize = 100;
    const totalItems = Math.max(sortedNotes.length, sortedExpenses.length, sortedLearning.length);
    const totalPages = Math.ceil(totalItems / pageSize) || 1;

    if (dailyCurrentPage > totalPages) dailyCurrentPage = totalPages;
    if (dailyCurrentPage < 1) dailyCurrentPage = 1;

    const startIdx = (dailyCurrentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;

    // 3. Render Sliced Lists
    notesList.innerHTML = sortedNotes.slice(startIdx, endIdx).map(n => `
                <tr class="border-b last:border-0 hover:bg-slate-50 group">
                    <td class="py-2 px-3 align-top whitespace-nowrap">
                        <div class="font-bold text-slate-800">${n.ngay || ''}</div>
                        <div class="text-[10px] text-slate-400">${getTimePart(n.ngay_in)}</div>
                    </td>
                    <td class="py-2 px-3">
                        <div class="flex justify-between items-start gap-2">
                            <div class="flex-1">
                                <div class="font-bold text-primary">${n.truong || ''}</div>
                                <div class="text-xs text-slate-600 line-clamp-2">${n.ghi_chu || ''}</div>
                            </div>
                            <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onclick="editNote('${n.id}')" class="p-1 text-blue-500 hover:bg-blue-50 rounded"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                                <button onclick="deleteNote('${n.id}')" class="p-1 text-rose-500 hover:bg-rose-50 rounded"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                            </div>
                        </div>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="2" class="p-8 text-center text-slate-400 italic">Không có dữ liệu phù hợp</td></tr>';

    expenseList.innerHTML = sortedExpenses.slice(startIdx, endIdx).map(e => `
                <tr class="border-b last:border-0 hover:bg-slate-50 group">
                    <td class="py-2 px-3 align-top whitespace-nowrap">
                        <div class="font-bold text-slate-800">${e.ngay || ''}</div>
                        <div class="text-[10px] text-slate-400">${getTimePart(e.ngay_h)}</div>
                    </td>
                    <td class="py-2 px-3">
                        <div class="flex justify-between items-start gap-2">
                            <div class="flex-1">
                                <div class="flex items-center gap-1">
                                    <span class="px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold ${e.thu_chi?.toUpperCase() === 'THU' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">${e.thu_chi || ''}</span>
                                    <span class="font-medium text-slate-700">${e.danh_muc || ''}</span>
                                </div>
                                <div class="text-[10px] text-slate-500 italic mt-0.5 truncate max-w-[100px]">${e.chi_tiet || ''}</div>
                            </div>
                            <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onclick="editExpense('${e.id}')" class="p-1 text-blue-500 hover:bg-blue-50 rounded"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                                <button onclick="deleteExpense('${e.id}')" class="p-1 text-rose-500 hover:bg-rose-50 rounded"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                            </div>
                        </div>
                    </td>
                    <td class="py-2 px-3 text-right">
                        <div class="font-bold ${e.thu_chi?.toUpperCase() === 'THU' ? 'text-emerald-600' : 'text-rose-600'}">
                            ${(parseFloat(e.so_tien) || 0).toLocaleString()}
                        </div>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="3" class="p-8 text-center text-slate-400 italic">Không có dữ liệu phù hợp</td></tr>';

    learningList.innerHTML = sortedLearning.slice(startIdx, endIdx).map(l => `
                <tr class="border-b last:border-0 hover:bg-slate-50 group">
                    <td class="py-2 px-3 align-top font-bold text-slate-800 whitespace-nowrap">${l.ngay || ''}</td>
                    <td class="py-2 px-3">
                        <div class="flex justify-between items-start gap-2">
                            <div class="flex-1">
                                <div class="font-bold text-blue-600">${l.truong || ''}</div>
                                <div class="text-xs text-slate-600 line-clamp-3">${l.noi_dung || ''}</div>
                            </div>
                            <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onclick="editLearning('${l.id}')" class="p-1 text-blue-500 hover:bg-blue-50 rounded"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                                <button onclick="deleteLearning('${l.id}')" class="p-1 text-rose-500 hover:bg-rose-50 rounded"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                            </div>
                        </div>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="2" class="p-8 text-center text-slate-400 italic">Không có dữ liệu phù hợp</td></tr>';

    // 4. Update Stats & Pagination UI
    document.getElementById('daily-stat-notes').textContent = filteredNotes.length;
    document.getElementById('daily-stat-expense').textContent = filteredExpenses.reduce((sum, e) => sum + (parseFloat(e.so_tien) || 0), 0).toLocaleString() + ' đ';
    document.getElementById('daily-stat-learning').textContent = filteredLearning.length;

    document.getElementById('daily-current-page').textContent = dailyCurrentPage;
    document.getElementById('daily-total-pages').textContent = totalPages;
    document.getElementById('daily-prev-btn').disabled = dailyCurrentPage <= 1;
    document.getElementById('daily-next-btn').disabled = dailyCurrentPage >= totalPages;
}

function changeDailyPage(delta) {
    dailyCurrentPage += delta;
    renderDailySummary();
}

function setDailyQuickFilter(type) {
    const startInput = document.getElementById('daily-filter-start');
    const endInput = document.getElementById('daily-filter-end');
    const now = new Date();
    let start, end;

    const format = (d) => {
        const y = d.getFullYear();
        const mo = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${mo}-${day}`;
    };

    if (type === 'today') {
        start = end = now;
    } else if (type === 'thisWeek') {
        const day = now.getDay() || 7; // Treat Sunday as 7
        start = new Date(now);
        start.setDate(now.getDate() - (day - 1));
        end = new Date(start);
        end.setDate(start.getDate() + 6);
    } else if (type === 'lastWeek') {
        const day = now.getDay() || 7;
        start = new Date(now);
        start.setDate(now.getDate() - (day - 1) - 7);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
    } else if (type === 'thisMonth') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    if (start && end) {
        startInput.value = format(start);
        endInput.value = format(end);
        renderDailySummary(true);
    }
}

function clearDailyFilters() {
    document.getElementById('daily-filter-start').value = '';
    document.getElementById('daily-filter-end').value = '';
    document.getElementById('daily-filter-search').value = '';
    renderDailySummary(true);
}

function getTimePart(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.trim().split(' ');
    return parts[1] ? parts[1].substring(0, 5) : '';
}

function calcDuration(start, end) {
    if (!start || !end) return '-';
    try {
        const s = new Date(start.replace(' ', 'T'));
        const e = new Date(end.replace(' ', 'T'));
        if (isNaN(s) || isNaN(e)) return '-';
        let diff = e - s;
        if (diff < 0) return 'Lỗi';
        const mins = Math.floor(diff / 60000);
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        if (h > 0) return `${h}h ${m}p`;
        return `${m}p`;
    } catch (e) { return '-'; }
}

function calcAging(dateStr) {
    if (!dateStr) return '-';
    try {
        const recordDate = new Date(dateStr.includes('/') ? dateStr.split('/').reverse().join('-') : dateStr);
        if (isNaN(recordDate)) return '-';

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        recordDate.setHours(0, 0, 0, 0);

        const diffTime = today - recordDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 ? diffDays : 0;
    } catch (e) { return '-'; }
}

function setNotesQuickFilter(type) {
    const startInput = document.getElementById('notes-filter-start');
    const endInput = document.getElementById('notes-filter-end');
    const now = new Date();
    let start, end;

    const format = (d) => {
        const y = d.getFullYear();
        const mo = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${mo}-${day}`;
    };

    if (type === 'today') {
        start = end = now;
    } else if (type === 'thisWeek') {
        const day = now.getDay() || 7;
        start = new Date(now);
        start.setDate(now.getDate() - (day - 1));
        end = new Date(start);
        end.setDate(start.getDate() + 6);
    } else if (type === 'thisMonth') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    if (start && end) {
        startInput.value = format(start);
        endInput.value = format(end);
        renderNotes(true);
    }
}

function clearNotesFilters() {
    document.getElementById('notes-filter-start').value = '';
    document.getElementById('notes-filter-end').value = '';
    document.getElementById('notes-filter-search').value = '';
    renderNotes(true);
}

function parseSortDateDaily(dStr) {
    if (!dStr) return 0;
    if (dStr.includes('-')) {
        const parts = dStr.split(' ');
        const dateParts = parts[0].split('-'); // [Y, M, D]
        const timePart = parts[1] || '00:00';
        return new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}T${timePart}`).getTime();
    }
    if (dStr.includes('/')) {
        const parts = dStr.split(' ');
        const dateParts = parts[0].split('/'); // [D, M, Y]
        const timePart = parts[1] || '00:00';
        return new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timePart}`).getTime();
    }
    const finalTs = new Date(dStr).getTime();
    return isNaN(finalTs) ? 0 : finalTs;
}

function switchModule(module) {
    currentModule = module;

    document.querySelectorAll('.module-container').forEach(el => el.classList.add('hidden'));
    const modEl = document.getElementById(`module-${module}`);
    if (modEl) {
        modEl.classList.remove('hidden');
        // Call init functions AFTER showing module
        if (module === 'add') initQuickAddForm();
        if (module === 'notes') renderNotes();
        if (module === 'expense') renderExpenses();
        if (module === 'learning') renderLearning();
        if (module === 'dashboard') renderExpenseDashboard();
        if (module === 'daily') setDailyQuickFilter('today');
        if (module === 'calendar') renderCalendar();
    }

    // Handle sidebar active state
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active', 'bg-primary', 'text-white'));
    const navEl = document.getElementById(`nav-${module}`);
    if (navEl) navEl.classList.add('active', 'bg-primary', 'text-white');

    // Handle mobile bottom nav active state
    document.querySelectorAll('.mobile-nav-item').forEach(el => {
        const onclickAttr = el.getAttribute('onclick') || '';
        if (onclickAttr.includes(`'${module}'`)) {
            el.classList.add('text-primary');
            el.classList.remove('text-slate-500');
        } else {
            el.classList.remove('text-primary');
            el.classList.add('text-slate-500');
        }
    });

    // Close mobile sidebar if open
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar && !sidebar.classList.contains('-translate-x-full') && window.innerWidth < 768) {
        toggleSidebarMobile();
    }
}

/* --- CALENDAR LOGIC --- */
let currentCalendarDate = new Date();
const CALENDAR_VIEW_PREFS_KEY = 'calendarViewPrefs';
const CALENDAR_FILTER_IDS = [
    'cal-filter-notes',
    'cal-filter-expense',
    'cal-filter-learning',
    'cal-filter-birthday',
    'cal-filter-past-notes'
];

function saveCalendarViewPrefs() {
    const prefs = {};
    CALENDAR_FILTER_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) prefs[id] = el.checked;
    });
    const searchEl = document.getElementById('cal-search');
    if (searchEl) prefs.search = searchEl.value;
    localStorage.setItem(CALENDAR_VIEW_PREFS_KEY, JSON.stringify(prefs));
}

function restoreCalendarViewPrefs() {
    try {
        const prefs = JSON.parse(localStorage.getItem(CALENDAR_VIEW_PREFS_KEY) || '{}');
        CALENDAR_FILTER_IDS.forEach(id => {
            const el = document.getElementById(id);
            if (el && typeof prefs[id] === 'boolean') el.checked = prefs[id];
        });
        const searchEl = document.getElementById('cal-search');
        if (searchEl && typeof prefs.search === 'string') searchEl.value = prefs.search;
    } catch (e) { /* ignore invalid stored prefs */ }
}

function handleCalendarFilterChange() {
    saveCalendarViewPrefs();
    renderCalendar();
}

function changeCalendarMonth(delta) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
    renderCalendar();
}

function goCalendarToday() {
    currentCalendarDate = new Date();
    renderCalendar();
}

function normalizeCalendarKey(dateStr) {
    const parsed = parseSimpleDate(dateStr);
    if (!parsed || !parsed.includes('/')) return '';
    const [d, m, y] = parsed.split('/');
    return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

function calendarKeyToInputDate(dKey) {
    const [d, m, y] = dKey.split('/');
    return `${y}-${m}-${d}`;
}

function renderCalDayCard(type, item) {
    if (type === 'note') {
        return `<div class="bg-white border border-blue-100 rounded-xl p-3">
            <div class="text-[10px] font-bold text-blue-600 uppercase mb-1">${escapeHTML(item.truong || 'Ghi chú')}</div>
            <div onclick="openRecordFieldPreview('notes','${item.id}','ghi_chu','Ghi chú')" class="preview-cell text-sm font-bold text-slate-800 line-clamp-2">${escapeHTML(item.ghi_chu || item.noi_dung || '')}</div>
            <div class="text-[10px] text-slate-400 mt-2">${escapeHTML(getTimePart(item.ngay_in) || item.ngay || '')}</div>
        </div>`;
    }
    if (type === 'expense') {
        const isThu = item.thu_chi?.toUpperCase() === 'THU';
        return `<div class="bg-white border border-rose-100 rounded-xl p-3">
            <div class="flex justify-between gap-3">
                <div>
                    <div class="text-[10px] font-bold ${isThu ? 'text-emerald-600' : 'text-rose-600'} uppercase">${escapeHTML(item.thu_chi || '')}</div>
                    <div onclick="openRecordFieldPreview('expense','${item.id}','chi_tiet','Chi tiết')" class="preview-cell text-sm font-bold text-slate-800 line-clamp-2">${escapeHTML(item.danh_muc || '')}: ${escapeHTML(item.chi_tiet || '')}</div>
                </div>
                <div class="font-bold whitespace-nowrap ${isThu ? 'text-emerald-600' : 'text-rose-600'}">${isThu ? '+' : '-'}${(parseFloat(item.so_tien) || 0).toLocaleString()}đ</div>
            </div>
        </div>`;
    }
    return `<div class="bg-white border border-emerald-100 rounded-xl p-3">
        <div class="text-[10px] font-bold text-emerald-600 uppercase mb-1">${escapeHTML(item.truong || 'Học hỏi')}</div>
        <div onclick="openRecordFieldPreview('learning','${item.id}','noi_dung','Nội dung')" class="preview-cell text-sm font-bold text-slate-800 line-clamp-2">${escapeHTML(item.noi_dung || item.ghi_chu || '')}</div>
    </div>`;
}

function showCalendarDayDetails(dKey) {
    selectedCalendarDayIso = calendarKeyToInputDate(dKey);
    const dayNotes = notesData.filter(n => normalizeCalendarKey(n.ngay) === dKey);
    const dayExpenses = expensesData.filter(e => normalizeCalendarKey(e.ngay) === dKey);
    const dayLearning = learningData.filter(l => normalizeCalendarKey(l.ngay) === dKey);

    document.getElementById('calDayTitle').textContent = `Chi tiết ngày ${dKey}`;
    document.getElementById('calDaySubtitle').textContent = `${dayNotes.length} ghi chú • ${dayExpenses.length} chi tiêu • ${dayLearning.length} học hỏi`;
    document.getElementById('calDay-notes-list').innerHTML = dayNotes.map(n => renderCalDayCard('note', n)).join('') || '<div class="text-sm text-slate-400 italic">Không có ghi chú</div>';
    document.getElementById('calDay-expense-list').innerHTML = dayExpenses.map(e => renderCalDayCard('expense', e)).join('') || '<div class="text-sm text-slate-400 italic">Không có chi tiêu</div>';
    document.getElementById('calDay-learning-list').innerHTML = dayLearning.map(l => renderCalDayCard('learning', l)).join('') || '<div class="text-sm text-slate-400 italic">Không có học hỏi</div>';

    const overlay = document.getElementById('calDayModalOverlay');
    const modal = document.getElementById('calDayModal');
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('opacity-100', 'scale-100');
        modal.classList.remove('opacity-0', 'scale-95');
    }, 10);
}

function closeCalDayModal() {
    const overlay = document.getElementById('calDayModalOverlay');
    const modal = document.getElementById('calDayModal');
    modal.classList.add('opacity-0', 'scale-95');
    modal.classList.remove('opacity-100', 'scale-100');
    setTimeout(() => {
        overlay.classList.add('hidden');
        modal.classList.add('hidden');
    }, 200);
}

function renderCalendar() {
    if (currentModule !== 'calendar') return;

    const grid = document.getElementById('calendar-grid');
    const monthTitle = document.getElementById('calendar-current-month');
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    monthTitle.innerText = `Tháng ${month + 1}, ${year}`;
    grid.innerHTML = '';
    const searchQuery = (document.getElementById('cal-search')?.value || "").toLowerCase().trim();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDay = firstDay.getDay();
    if (startDay === 0) startDay = 7;

    const totalCells = 42; // 6 rows * 7 days
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const showNotes = document.getElementById('cal-filter-notes').checked;
    const showExpense = document.getElementById('cal-filter-expense').checked;
    const showLearning = document.getElementById('cal-filter-learning').checked;
    const showBirthday = document.getElementById('cal-filter-birthday').checked;
    const showPastNotes = document.getElementById('cal-filter-past-notes').checked;

    const allEvents = [];

    const matchesSearch = (text) => !searchQuery || String(text).toLowerCase().includes(searchQuery);

    if (showNotes) {
        notesData.forEach(n => {
            const content = `${n.id} ${n.truong} ${n.loai} ${n.ghi_chu} ${n.doi_tuong}`;
            if (matchesSearch(content)) {
                allEvents.push({ ...n, _type: 'note', _date: parseSimpleDate(n.ngay) });
            }
        });
    }
    if (showExpense) {
        expensesData.forEach(e => {
            const content = `${e.id} ${e.danh_muc} ${e.so_tien} ${e.ghi_chu} ${e.tk_chi} ${e.tk_thu}`;
            if (matchesSearch(content)) {
                allEvents.push({ ...e, _type: 'expense', _date: parseSimpleDate(e.ngay) });
            }
        });
    }
    if (showLearning) {
        learningData.forEach(l => {
            const content = `${l.id} ${l.truong} ${l.noi_dung} ${l.tags}`;
            if (matchesSearch(content)) {
                allEvents.push({ ...l, _type: 'learning', _date: parseSimpleDate(l.ngay) });
            }
        });
    }

    if (showBirthday) {
        staffData.forEach(s => {
            if (s.ngay_sinh) {
                try {
                    const name = s.ho_ten || s.id;
                    if (matchesSearch(name)) {
                        const parts = s.ngay_sinh.split('/');
                        if (parts.length >= 2) {
                            const bDate = `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${year}`;
                            allEvents.push({ ...s, _type: 'birthday', _date: bDate, truong: `Sinh nhật ${name}` });
                        }
                    }
                } catch (e) { /* skip */ }
            }
        });
    }

    // Process Past Year Notes
    const pastNotesMap = {};
    if (showPastNotes) {
        notesData.forEach(n => {
            const nDate = parseSimpleDate(n.ngay);
            if (nDate) {
                const [d, m, y] = nDate.split('/');
                if (parseInt(y) < year) {
                    const noteLine = `${nDate} ${n.truong || 'Ghi chú'}: ${n.ghi_chu || ''}`;
                    if (matchesSearch(noteLine)) {
                        const key = `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${year}`;
                        if (!pastNotesMap[key]) pastNotesMap[key] = [];
                        pastNotesMap[key].push(noteLine);
                    }
                }
            }
        });
    }

    for (let i = 1; i <= totalCells; i++) {
        const dayDiv = document.createElement('div');

        let dayNum, cellMonth, cellYear;
        if (i < startDay) {
            dayNum = prevMonthLastDay - (startDay - i - 1);
            cellMonth = month - 1;
            cellYear = year;
        } else if (i >= startDay && i < startDay + lastDay.getDate()) {
            dayNum = i - startDay + 1;
            cellMonth = month;
            cellYear = year;
        } else {
            dayNum = i - (startDay + lastDay.getDate() - 1);
            cellMonth = month + 1;
            cellYear = year;
        }

        const dKey = `${dayNum.toString().padStart(2, '0')}/${(new Date(cellYear, cellMonth, 1).getMonth() + 1).toString().padStart(2, '0')}/${new Date(cellYear, cellMonth, 1).getFullYear()}`;
        const dayEvents = allEvents.filter(e => e._date === dKey);
        const pastNotesCount = pastNotesMap[dKey]?.length || 0;
        const visibleEventCount = dayEvents.length + pastNotesCount;
        const isToday = (dayNum === new Date().getDate() && cellMonth === new Date().getMonth() && cellYear === new Date().getFullYear());
        const isCurrentMonth = (cellMonth === month);

        let cellClass = `calendar-day p-2 h-[160px] border border-slate-100 flex flex-col gap-1 transition-all hover:bg-slate-50 cursor-pointer overflow-y-auto custom-scrollbar `;
        if (!isCurrentMonth) cellClass += 'bg-slate-50/50 text-slate-300 ';
        else if (isToday) cellClass += 'bg-blue-50/50 border-primary/30 z-10 ';
        else cellClass += 'bg-white text-slate-700 ';
        if (visibleEventCount > 0) cellClass += 'has-events ';

        dayDiv.className = cellClass;
        dayDiv.onclick = () => showCalendarDayDetails(dKey);

        dayDiv.innerHTML = `
                    <div class="flex justify-between items-start mb-1">
                        <span class="text-sm font-bold ${isToday ? 'bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full shadow-sm' : ''}">${dayNum}</span>
                        ${visibleEventCount > 0 ? `<span class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold" title="${visibleEventCount} mục hiển thị trong ngày">${visibleEventCount}</span>` : ''}
                    </div>
                `;

        // Add ALL events without slicing
        dayEvents.forEach(ev => {
            let color = 'bg-slate-400';
            let text = ev.truong || '';
            if (ev._type === 'note') {
                color = 'bg-blue-500';
                text = `📝 <b>${ev.truong}</b>: ${ev.ghi_chu || ev.noi_dung || ''}`;
            }
            else if (ev._type === 'expense') {
                color = 'bg-rose-500';
                text = `💰 <b>${ev.danh_muc}</b>: ${ev.chi_tiet || ev.ghi_chu || ''} (${parseFloat(ev.so_tien || 0).toLocaleString()}đ)`;
            }
            else if (ev._type === 'learning') {
                color = 'bg-emerald-500';
                text = `📚 <b>${ev.truong}</b>: ${ev.noi_dung || ''}`;
            }
            else if (ev._type === 'birthday') {
                color = 'bg-yellow-500';
                text = `🎂 <b>${ev.truong}</b>`;
            }

            dayDiv.innerHTML += `<div class="text-[11px] px-1.5 py-0.5 rounded shadow-sm text-white ${color} mb-[3px] leading-tight break-words">${text}</div>`;
        });

        // Past notes indicator
        if (pastNotesMap[dKey]) {
            pastNotesMap[dKey].forEach(pastLine => {
                dayDiv.innerHTML += `<div class="text-[11px] bg-[#5ce1e6]/10 text-[#2a8b8e] border border-[#5ce1e6] shadow-sm rounded px-1.5 py-0.5 break-words italic mb-[3px]">⏳ ${pastLine}</div>`;
            });
        }

        grid.appendChild(dayDiv);
    }
}

function parseSimpleDate(dStr) {
    if (!dStr) return '';
    const d = dStr.split(' ')[0]; // Take only date part
    if (d.includes('/')) return d; // DD/MM/YYYY
    if (d.includes('-')) return d.split('-').reverse().join('/'); // YYYY-MM-DD -> DD/MM/YYYY
    return d;
}

// Auth
async function handleLogin() {
    const uidInput = document.getElementById('usernameInput').value.trim();
    const pwdInput = document.getElementById('passwordInput').value.trim();
    const remember = document.getElementById('rememberPassword').checked;

    if (!uidInput || !pwdInput) return alert("Vui lòng nhập đầy đủ thông tin!");

    const btn = document.querySelector('#loginScreen button');
    const originalText = btn.innerText;
    btn.innerText = "Đang kiểm tra...";
    btn.disabled = true;

    try {
        const staffData = await fetchSheetData(CONFIG.authSheetName);
        const user = staffData.find(u => (u.id === uidInput || u.id === uidInput.toLowerCase()) && String(u.mk) === pwdInput);

        if (user) {
            currentUser = { id: user.id, name: user.ho_ten, role: user.quyen };
            if (remember) localStorage.setItem('savedLogin', JSON.stringify({ uid: uidInput, pwd: pwdInput }));
            else localStorage.removeItem('savedLogin');

            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('mainApp').classList.remove('hidden');
            document.getElementById('sidebarUserName').textContent = currentUser.name;
            document.getElementById('sidebarUserId').textContent = "ID: " + currentUser.id;
            await loadAllData(false);
            switchModule('notes');
            startAutoRefresh();
        } else {
            alert("Sai tài khoản hoặc mật khẩu!");
        }
    } catch (err) {
        alert("Lỗi kết nối: " + err.message);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}
function handleLogout() {
    currentUser = null;
    if (autoRefreshInterval) { clearInterval(autoRefreshInterval); autoRefreshInterval = null; }
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginScreen').style.display = 'flex';
}
let autoRefreshInterval = null;
function startAutoRefresh() {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
    autoRefreshInterval = setInterval(async () => {
        if (!currentUser) return;
        try {
            await loadAllData(true);
            // Re-render current module silently
            if (currentModule === 'dashboard') renderExpenseDashboard();
        } catch (e) { /* silent fail */ }
    }, 60000); // 60 seconds
}

window.onload = async () => {
    restoreCalendarViewPrefs();

    // Trigger background load immediately
    loadAllData(false);

    const saved = localStorage.getItem('savedLogin');
    if (saved) {
        const { uid, pwd } = JSON.parse(saved);
        document.getElementById('usernameInput').value = uid;
        document.getElementById('passwordInput').value = pwd;
        document.getElementById('rememberPassword').checked = true;
        handleLogin();
    }
};

function updateDailyInsights(start, end) {
    const banner = document.getElementById('daily-insight-banner');
    const textEl = document.getElementById('daily-insight-text');
    const statsEl = document.getElementById('daily-insight-stats');
    if (!banner || !textEl || !statsEl) return;
    if (!start || start !== end) { banner.classList.add('hidden'); return; }
    banner.classList.remove('hidden');
    const todayStr = formatDateForSheet(start);
    const tNotes = notesData.filter(n => n.ngay === todayStr);
    const tExpense = expensesData.filter(e => e.ngay === todayStr && e.thu_chi === 'CHI');
    const tTotalExp = tExpense.reduce((s, e) => s + (parseFloat(e.so_tien) || 0), 0);
    const yDate = new Date(start); yDate.setDate(yDate.getDate() - 1);
    const yStr = formatDateForSheet(yDate.toISOString().split('T')[0]);
    const yExpense = expensesData.filter(e => e.ngay === yStr && e.thu_chi === 'CHI');
    const yTotalExp = yExpense.reduce((s, e) => s + (parseFloat(e.so_tien) || 0), 0);
    let insightText = `Hôm nay bạn có ${tNotes.length} ghi chú mới. `;
    if (tTotalExp > 0) {
        if (yTotalExp > 0) {
            const diff = ((tTotalExp - yTotalExp) / yTotalExp * 100).toFixed(0);
            insightText += diff > 0 ? `Chi tiêu cao hơn ${diff}% so với hôm qua.` : `Chi tiêu thấp hơn ${Math.abs(diff)}% so với hôm qua. ✨`;
        } else insightText += `Bạn đã chi tiêu ${tTotalExp.toLocaleString()}đ.`;
    } else insightText += `Bạn chưa có chi tiêu nào. Tuyệt vời! 🚀`;
    textEl.innerText = insightText;
    statsEl.innerHTML = `<div class="flex flex-col"><span class="text-white/60">Hôm nay</span><span>${tTotalExp.toLocaleString()}đ</span></div><div class="w-[1px] bg-white/20"></div><div class="flex flex-col"><span class="text-white/60">Hôm qua</span><span>${yTotalExp.toLocaleString()}đ</span></div>`;
}


