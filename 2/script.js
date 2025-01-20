document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const compressButton = document.getElementById('compressButton');
    const previewImage = document.getElementById('previewImage');
    const originalInfo = document.getElementById('originalInfo');
    const compressedInfo = document.getElementById('compressedInfo');
    const compressedImage = document.getElementById('compressedImage');
    let originalFile = null;

    // 更新质量显示
    quality.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
    });

    // 点击上传区域触发文件选择
    dropZone.addEventListener('click', function() {
        fileInput.click();
    });

    // 处理拖拽事件
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // 处理文件选择
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    // 处理文件函数
    function handleFiles(files) {
        if (files.length === 0) return;
        
        const file = files[0];
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件！');
            return;
        }

        originalFile = file;
        displayFileInfo(file);
        previewFile(file);
        compressButton.disabled = false;
    }

    // 显示文件信息
    function displayFileInfo(file) {
        const size = (file.size / 1024).toFixed(2);
        originalInfo.textContent = `文件大小: ${size} KB`;
    }

    // 预览图片
    function previewFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }

    // 压缩图片
    compressButton.addEventListener('click', function() {
        if (!originalFile) return;

        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                compressedImage.src = url;
                
                const compressedSize = (blob.size / 1024).toFixed(2);
                const originalSize = (originalFile.size / 1024).toFixed(2);
                const compressionRatio = ((1 - blob.size / originalFile.size) * 100).toFixed(1);
                
                compressedInfo.textContent = `文件大小: ${compressedSize} KB\n压缩率: ${compressionRatio}%`;

                const a = document.createElement('a');
                a.href = url;
                a.download = 'compressed_' + originalFile.name;
                a.click();
            }, 'image/jpeg', quality.value / 100);
        };
        
        img.src = URL.createObjectURL(originalFile);
    });
}); 