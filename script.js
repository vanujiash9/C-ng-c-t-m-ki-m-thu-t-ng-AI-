document.addEventListener('DOMContentLoaded', function () {
    // --- Khai báo dữ liệu mặc định ---
    const defaultTerms = [
      {
        term: 'Adaptive Systems',
        definition: 'Hệ thống tự điều chỉnh hành vi dựa trên phản hồi môi trường',
        keywords: 'Học tăng cường, Tối ưu hóa động, Thích ứng môi trường',
        category: 'systems',
        application: 'control'
      },
      {
        term: 'Bayesian Networks',
        definition: 'Mô hình xác suất biểu diễn mối quan hệ nhân quả giữa các biến',
        keywords: 'Suy luận xác suất, Dự đoán xu hướng, Học máy Bayes',
        category: 'ml',
        application: 'reasoning'
      },
      {
        term: 'Decision Tree',
        definition: 'Cấu trúc phân nhánh cho quyết định dựa trên đặc tính dữ liệu',
        keywords: 'Phân loại, Hồi quy',
        category: 'ml',
        application: 'classification'
      },
      {
        term: 'Exploration-Exploitation',
        definition: 'Sự cân bằng giữa khám phá thông tin mới và tận dụng kiến thức hiện có',
        keywords: 'Multi-armed bandit, Tối ưu dài hạn, Chiến lược epsilon-greedy',
        category: 'systems',
        application: 'optimization'
      },
      {
        term: 'Fuzzy Logic',
        definition: 'Hệ logic xử lý giá trị chân lý mờ thay vì nhị phân',
        keywords: 'Tập mờ, Hàm thành viên, Suy luận xấp xỉ',
        category: 'reasoning',
        application: 'reasoning'
      },
      {
        term: 'Genetic Algorithms',
        definition: 'Kỹ thuật tối ưu lấy cảm hứng từ tiến hóa sinh học',
        keywords: 'Chọn lọc tự nhiên, Đột biến, Lai ghép',
        category: 'ml',
        application: 'optimization'
      },
      {
        term: 'Heuristic Search',
        definition: 'Phương pháp tìm kiếm ưu tiên các lựa chọn triển vọng nhất',
        keywords: 'A* algorithm, Chi phí ước lượng, Tối ưu tổ hợp',
        category: 'reasoning',
        application: 'search'
      }
    ];
  
    // --- Biến toàn cục ---
    let aiTerms = [];
    let filteredTerms = [];
    let currentPage = 1;
    // Hiển thị 20 thuật ngữ mỗi trang
    const termsPerPage = 20;
  
    let currentTheme = localStorage.getItem('theme') || 'light';
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
    // Lưu danh sách “Thuật ngữ mới” (tối đa 5) trong localStorage
    let recentlyAddedTerms = JSON.parse(localStorage.getItem('recentlyAddedTerms')) || [];
  
    // --- Hàm cập nhật giao diện danh sách “Thuật ngữ mới” ---
    function updateRecentlyAddedUI() {
      const list = document.getElementById('recentlyAddedList');
      if (!list) return;
      list.innerHTML = '';
      recentlyAddedTerms.forEach(termName => {
        const li = document.createElement('li');
        li.textContent = termName;
        list.appendChild(li);
      });
    }
  
    // --- Lấy & lưu dữ liệu qua localStorage ---
    function loadTerms() {
      const stored = localStorage.getItem('aiTerms');
      if (stored) {
        try {
          aiTerms = JSON.parse(stored);
        } catch (e) {
          aiTerms = defaultTerms;
        }
      } else {
        aiTerms = defaultTerms;
      }
    }
    function saveTerms() {
      localStorage.setItem('aiTerms', JSON.stringify(aiTerms));
    }
    loadTerms();
    updateRecentlyAddedUI();
  
    // --- Dark mode ---
    function applyTheme(theme) {
      document.body.dataset.theme = theme;
      document.getElementById('themeToggle').innerHTML =
        theme === 'dark'
          ? '<i class="fas fa-sun"></i> Chế độ sáng'
          : '<i class="fas fa-moon"></i> Chế độ tối';
    }
    applyTheme(currentTheme);
    document.getElementById('themeToggle').addEventListener('click', function () {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(currentTheme);
      localStorage.setItem('theme', currentTheme);
    });
  
    // --- Đăng nhập ---
    function updateLoginStatus() {
      if (isLoggedIn) {
        document.getElementById('loginBtn').innerHTML = '<i class="fas fa-sign-out-alt"></i> Đăng xuất';
      } else {
        document.getElementById('loginBtn').innerHTML = '<i class="fas fa-user"></i> Đăng nhập';
      }
    }
    updateLoginStatus();
    document.getElementById('loginBtn').addEventListener('click', function () {
      if (isLoggedIn) {
        isLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
        updateLoginStatus();
      } else {
        document.getElementById('loginModal').classList.add('show');
      }
    });
    document.getElementById('closeLoginModal').addEventListener('click', function () {
      document.getElementById('loginModal').classList.remove('show');
    });
    document.getElementById('loginForm').addEventListener('submit', function (event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      if (username === 'admin' && password === 'password') {
        isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        updateLoginStatus();
        document.getElementById('loginModal').classList.remove('show');
      } else {
        document.getElementById('loginError').textContent = 'Tên đăng nhập hoặc mật khẩu không đúng.';
      }
    });
  
    // --- Mở modal Thêm Thuật Ngữ ---
    const openNewTermModalBtn = document.getElementById('openNewTermModal');
    const newTermModal = document.getElementById('newTermModal');
    const closeNewTermModalBtn = document.getElementById('closeNewTermModal');
    openNewTermModalBtn.addEventListener('click', function () {
      newTermModal.classList.add('show');
    });
    closeNewTermModalBtn.addEventListener('click', function () {
      newTermModal.classList.remove('show');
    });
  
    // --- Thêm mới thuật ngữ ---
    document.getElementById('newTermForm').addEventListener('submit', function (event) {
      event.preventDefault();
      const newTerm = {
        term: document.getElementById('newTerm').value.trim(),
        definition: document.getElementById('newDefinition').value.trim(),
        keywords: document.getElementById('newKeywords').value.trim(),
        category: document.getElementById('newCategory').value.trim(),
        application: document.getElementById('newApplication').value.trim()
      };
      if (newTerm.term) {
        // 1) Thêm vào mảng chính
        aiTerms.push(newTerm);
        saveTerms();
  
        // 2) Cập nhật danh sách “Thuật ngữ mới”
        recentlyAddedTerms.unshift(newTerm.term);
        if (recentlyAddedTerms.length > 5) {
          recentlyAddedTerms.pop();
        }
        localStorage.setItem('recentlyAddedTerms', JSON.stringify(recentlyAddedTerms));
        updateRecentlyAddedUI();
  
        // 3) Cập nhật bảng và thống kê
        applyFilters();
        updateStats();
  
        // 4) Đóng modal và reset form
        this.reset();
        newTermModal.classList.remove('show');
      }
    });
  
    // --- Chỉnh sửa thuật ngữ ---
    window.editTerm = function (termName) {
      const termToEdit = aiTerms.find(t => t.term === termName);
      if (termToEdit) {
        document.getElementById('editTerm').value = termToEdit.term;
        document.getElementById('editDefinition').value = termToEdit.definition;
        document.getElementById('editKeywords').value = termToEdit.keywords;
        document.getElementById('editCategory').value = termToEdit.category;
        document.getElementById('editApplication').value = termToEdit.application;
        document.getElementById('originalTerm').value = termToEdit.term;
        document.getElementById('editModal').classList.add('show');
      }
    };
    document.getElementById('closeEditModal').addEventListener('click', function () {
      document.getElementById('editModal').classList.remove('show');
    });
    document.getElementById('editForm').addEventListener('submit', function (event) {
      event.preventDefault();
      const originalTerm = document.getElementById('originalTerm').value;
      const index = aiTerms.findIndex(t => t.term === originalTerm);
      if (index !== -1) {
        aiTerms[index] = {
          term: document.getElementById('editTerm').value.trim(),
          definition: document.getElementById('editDefinition').value.trim(),
          keywords: document.getElementById('editKeywords').value.trim(),
          category: document.getElementById('editCategory').value.trim(),
          application: document.getElementById('editApplication').value.trim()
        };
        saveTerms();
        applyFilters();
        updateStats();
        document.getElementById('editModal').classList.remove('show');
      }
    });
  
    // --- Xóa thuật ngữ ---
    window.deleteTerm = function (termName) {
      if (confirm('Bạn có chắc muốn xóa thuật ngữ: ' + termName + '?')) {
        aiTerms = aiTerms.filter(t => t.term !== termName);
        saveTerms();
        applyFilters();
        updateStats();
      }
    };
  
    // --- Render bảng và phân trang ---
    function renderTable() {
      const tableBody = document.getElementById('aiTermsTableBody');
      tableBody.innerHTML = '';
      const start = (currentPage - 1) * termsPerPage;
      const end = start + termsPerPage;
      const termsToShow = filteredTerms.slice(start, end);
      termsToShow.forEach(term => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${term.term}</td>
          <td>${term.definition}</td>
          <td>${term.keywords}</td>
          <td>
            <button class="edit-btn" onclick="editTerm('${term.term}')"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" onclick="deleteTerm('${term.term}')"><i class="fas fa-trash-alt"></i></button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }
    function renderPagination() {
      const pagination = document.getElementById('pagination');
      pagination.innerHTML = '';
      const totalPages = Math.ceil(filteredTerms.length / termsPerPage);
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.add('page-button');
        if (i === currentPage) btn.classList.add('active');
        btn.addEventListener('click', () => {
          currentPage = i;
          renderTable();
          renderPagination();
        });
        pagination.appendChild(btn);
      }
      if (totalPages > 0) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = '>';
        nextBtn.classList.add('page-button');
        nextBtn.addEventListener('click', () => {
          if (currentPage < totalPages) {
            currentPage++;
            renderTable();
            renderPagination();
          }
        });
        pagination.appendChild(nextBtn);
      }
    }
  
    // --- Lọc, sắp xếp, tìm kiếm ---
    function applyFilters() {
      const categoryVal = document.getElementById('categoryFilter').value;
      const applicationVal = document.getElementById('applicationFilter').value;
      const sortVal = document.getElementById('sortFilter').value;
      const searchVal = document.getElementById('searchInput').value.toLowerCase();
      filteredTerms = aiTerms.filter(term => {
        if (categoryVal && term.category !== categoryVal) return false;
        if (applicationVal && term.application !== applicationVal) return false;
        if (searchVal && !term.term.toLowerCase().includes(searchVal)
            && !term.definition.toLowerCase().includes(searchVal)
            && !term.keywords.toLowerCase().includes(searchVal)) return false;
        return true;
      });
      if (sortVal === 'name') {
        filteredTerms.sort((a, b) => a.term.localeCompare(b.term));
      } else if (sortVal === 'name-desc') {
        filteredTerms.sort((a, b) => b.term.localeCompare(a.term));
      }
      currentPage = 1;
      renderTable();
      renderPagination();
    }
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('applicationFilter').addEventListener('change', applyFilters);
    document.getElementById('sortFilter').addEventListener('change', applyFilters);
    document.getElementById('searchInput').addEventListener('input', applyFilters);
  
    // --- Cập nhật thống kê ---
    function updateStats() {
      document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = aiTerms.length + '+';
      document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = [...new Set(aiTerms.map(term => term.category))].length;
      document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = [
        ...new Set(aiTerms.flatMap(term => term.keywords.split(/,\s*/)))
      ].length;
      const now = new Date();
      document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = now.toLocaleString();
    }
  
    // --- Xuất dữ liệu (JSON, PDF, Word) ---
    const exportModal = document.getElementById('exportModal');
    const closeExportModalBtn = document.getElementById('closeExportModal');
    document.getElementById('exportBtn').addEventListener('click', function () {
      exportModal.classList.add('show');
    });
    closeExportModalBtn.addEventListener('click', function () {
      exportModal.classList.remove('show');
    });
  
    document.getElementById('exportForm').addEventListener('submit', function (event) {
      event.preventDefault();
      const format = document.getElementById('exportFormat').value;
      const scope = document.getElementById('exportScope').value;
      let exportData = [];
      if (scope === 'all') {
        exportData = aiTerms;
      } else if (scope === 'current') {
        exportData = filteredTerms;
      }
  
      if (format === 'json') {
        // Xuất JSON
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const anchor = document.createElement('a');
        anchor.setAttribute('href', dataStr);
        anchor.setAttribute('download', 'ai_terms.json');
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
  
      } else if (format === 'pdf') {
        // Xuất PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        // Nếu bạn đã nhúng font Times New Roman cho tiếng Việt:
        // doc.addFileToVFS("TimesNewRoman.ttf", timesNewRomanBase64);
        // doc.addFont("TimesNewRoman.ttf", "TimesNewRoman", "normal");
        // doc.setFont("TimesNewRoman", "normal");
  
        const columns = ["Thuật ngữ", "Định nghĩa", "Keywords", "Danh mục", "Ứng dụng"];
        const maxLength = 20;
        function truncateText(text, max) {
          return text.length > max ? text.substring(0, max) + "..." : text;
        }
        // Rút gọn về 20 ký tự
        const rows = exportData.map(term => [
          truncateText(term.term, maxLength),
          truncateText(term.definition, maxLength),
          truncateText(term.keywords, maxLength),
          truncateText(term.category, maxLength),
          truncateText(term.application, maxLength)
        ]);
        // Mỗi trang 20 dòng
        const chunkSize = 20;
        let startY = 10;
        for (let i = 0; i < rows.length; i += chunkSize) {
          const chunk = rows.slice(i, i + chunkSize);
          doc.autoTable({
            head: [columns],
            body: chunk,
            startY: startY,
            margin: { horizontal: 10 },
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 3 }
          });
          if (i + chunkSize < rows.length) {
            doc.addPage();
            startY = 10;
          }
        }
        doc.save("ai_terms.pdf");
  
      } else if (format === 'doc') {
        // Xuất Word (đơn giản, dạng .doc)
        // Tạo nội dung HTML
        let docContent = `
          <html>
            <head>
              <meta charset="UTF-8">
              <title>AI Terms</title>
            </head>
            <body>
              <table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th>Thuật ngữ</th>
                    <th>Định nghĩa</th>
                    <th>Keywords</th>
                    <th>Danh mục</th>
                    <th>Ứng dụng</th>
                  </tr>
                </thead>
                <tbody>
        `;
        exportData.forEach(term => {
          docContent += `
            <tr>
              <td>${term.term}</td>
              <td>${term.definition}</td>
              <td>${term.keywords}</td>
              <td>${term.category}</td>
              <td>${term.application}</td>
            </tr>
          `;
        });
        docContent += `
                </tbody>
              </table>
            </body>
          </html>
        `;
        // Tạo Blob rồi tải xuống
        const blob = new Blob([docContent], { type: "application/msword" });
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(blob);
        anchor.download = "ai_terms.doc";
        anchor.click();
        URL.revokeObjectURL(anchor.href);
  
      } else {
        alert('Định dạng chưa được hỗ trợ!');
      }
  
      exportModal.classList.remove('show');
    });
  
    // --- Nút cập nhật mới ---
    const updateBtn = document.getElementById('updateBtn');
    updateBtn.addEventListener('click', function () {
      applyFilters();
      updateStats();
      showNotification('Cập nhật thành công!');
    });
  
    // --- Hiển thị thông báo ---
    function showNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.classList.add('show');
      }, 10);
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    }
  
    // --- Lần đầu chạy ---
    applyFilters();
    updateStats();
  });
  