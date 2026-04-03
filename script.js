// Preenche a data de entrada com hoje
document.getElementById('data-entrada').valueAsDate = new Date();

// Adiciona serviço inicial
addService();

// Máscara para telefone
document.getElementById('telefone').addEventListener('input', function (e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) {
        v = '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4);
    } else if (v.length > 2) {
        v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
    } else if (v.length > 0) {
        v = '(' + v;
    }
    e.target.value = v;
});

// Máscara para placa (ABC-1234 ou ABC1D23)
document.getElementById('placa').addEventListener('input', function (e) {
    let v = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (v.length > 7) v = v.slice(0, 7);
    if (v.length > 3) {
        v = v.slice(0, 3) + '-' + v.slice(3);
    }
    e.target.value = v;
});

function addService() {
    var servicesList = document.getElementById('services-list');
    var serviceItem = document.createElement('div');
    serviceItem.className = 'service-item';

    var descInput = document.createElement('input');
    descInput.type = 'text';
    descInput.className = 'service-desc';
    descInput.placeholder = 'Descrição do serviço';

    var valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.className = 'service-value';
    valueInput.placeholder = 'R$ 0,00';
    valueInput.inputMode = 'numeric';
    valueInput.addEventListener('input', handleCurrencyInput);
    valueInput.addEventListener('input', updateTotal);

    var removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '\u00D7';
    removeBtn.addEventListener('click', function () {
        serviceItem.remove();
        updateTotal();
    });

    serviceItem.appendChild(descInput);
    serviceItem.appendChild(valueInput);
    serviceItem.appendChild(removeBtn);
    servicesList.appendChild(serviceItem);

    descInput.focus();
}

function handleCurrencyInput(e) {
    var v = e.target.value.replace(/\D/g, '');
    if (v === '') {
        e.target.value = '';
        return;
    }
    var num = parseInt(v, 10);
    e.target.value = (num / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function parseCurrency(str) {
    if (!str) return 0;
    var clean = str.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(clean) || 0;
}

function updateTotal() {
    var values = document.querySelectorAll('.service-value');
    var total = 0;
    values.forEach(function (input) {
        total += parseCurrency(input.value);
    });
    document.getElementById('total-display').textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function clearForm() {
    if (!confirm('Tem certeza que deseja limpar todos os campos?')) return;

    document.getElementById('os').value = '';
    document.getElementById('cliente').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('veiculo').value = '';
    document.getElementById('placa').value = '';
    document.getElementById('cor').value = '';
    document.getElementById('data-entrada').valueAsDate = new Date();
    document.getElementById('data-entrega').value = '';
    document.getElementById('observacoes').value = '';

    document.getElementById('services-list').innerHTML = '';
    addService();
    updateTotal();
}

// ===== GERAÇÃO DE PDF =====

function getFileName() {
    var cliente = document.getElementById('cliente').value.trim();
    var placa = document.getElementById('placa').value.trim();
    var os = document.getElementById('os').value.trim();
    var parts = ['OS'];
    if (os) parts.push(os);
    if (cliente) parts.push(cliente.split(' ')[0]);
    if (placa) parts.push(placa);
    return parts.join('_') + '.pdf';
}

function prepareForCapture() {
    var container = document.querySelector('.container');
    var body = document.body;

    // Salva largura original
    var originalWidth = container.style.width;
    var originalMaxWidth = container.style.maxWidth;
    var originalBodyPadding = body.style.padding;
    var originalBodyBackground = body.style.backgroundColor;

    // Define tamanho padrão para A4 (800px @ 96dpi = 210mm)
    container.style.width = '800px';
    container.style.maxWidth = '800px';
    body.style.padding = '0';
    body.style.backgroundColor = 'white';

    // Esconde botões e elementos de ação
    var actions = document.querySelector('.actions');
    var addBtn = document.querySelector('.add-service-btn');
    var removeBtns = document.querySelectorAll('.remove-btn');
    var shAct = document.querySelector('.sh-act');

    actions.style.display = 'none';
    addBtn.style.display = 'none';
    if (shAct) shAct.style.display = 'none';
    removeBtns.forEach(function (btn) { btn.style.display = 'none'; });

    // Estiliza inputs para parecerem texto impresso
    var inputs = container.querySelectorAll('input, textarea');
    inputs.forEach(function (input) {
        input.style.border = 'none';
        input.style.background = 'transparent';
        input.style.boxShadow = 'none';
        input.style.borderBottom = '1px solid #ccc';
        input.style.borderRadius = '0';
        input.style.padding = '4px 0';
    });

    // Input da OS no header precisa de cor preta
    var osInput = document.getElementById('os');
    osInput.style.color = '#333';
    osInput.style.borderBottom = '1px solid #666';

    return {
        container: container,
        body: body,
        originalWidth: originalWidth,
        originalMaxWidth: originalMaxWidth,
        originalBodyPadding: originalBodyPadding,
        originalBodyBackground: originalBodyBackground,
        actions: actions,
        addBtn: addBtn,
        removeBtns: removeBtns,
        shAct: shAct,
        inputs: inputs,
        osInput: osInput
    };
}

function restoreAfterCapture(refs) {
    // Restaura tamanho original
    refs.container.style.width = refs.originalWidth;
    refs.container.style.maxWidth = refs.originalMaxWidth;
    refs.body.style.padding = refs.originalBodyPadding;
    refs.body.style.backgroundColor = refs.originalBodyBackground;

    refs.actions.style.display = '';
    refs.addBtn.style.display = '';
    if (refs.shAct) refs.shAct.style.display = '';
    refs.removeBtns.forEach(function (btn) { btn.style.display = ''; });
    refs.inputs.forEach(function (input) {
        input.style.border = '';
        input.style.background = '';
        input.style.boxShadow = '';
        input.style.borderBottom = '';
        input.style.borderRadius = '';
        input.style.padding = '';
    });
    refs.osInput.style.color = '';
    refs.osInput.style.borderBottom = '';
}

function generatePDF() {
    var container = document.querySelector('.container');
    var refs = prepareForCapture();

    return html2canvas(container, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        windowWidth: 800
    }).then(function (canvas) {
        restoreAfterCapture(refs);

        var imgData = canvas.toDataURL('image/jpeg', 0.95);
        var jsPDFLib = window.jspdf || window.jsPDF;
        if (!jsPDFLib) throw new Error('Biblioteca jsPDF não carregou. Verifique sua conexão.');
        var jsPDF = jsPDFLib.jsPDF || jsPDFLib;
        var pdf = new jsPDF('p', 'mm', 'a4');

        var pageWidth = pdf.internal.pageSize.getWidth();
        var pageHeight = pdf.internal.pageSize.getHeight();
        var margin = 10;
        var usableWidth = pageWidth - margin * 2;

        var imgWidth = usableWidth;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight > pageHeight - margin * 2) {
            imgHeight = pageHeight - margin * 2;
            imgWidth = (canvas.width * imgHeight) / canvas.height;
        }

        var x = (pageWidth - imgWidth) / 2;
        pdf.addImage(imgData, 'JPEG', x, margin, imgWidth, imgHeight);

        return pdf;
    }).catch(function (err) {
        restoreAfterCapture(refs);
        throw err;
    });
}

function downloadPDF() {
    var btn = document.querySelector('.btn-download');
    var originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Gerando PDF...';

    generatePDF().then(function (pdf) {
        pdf.save(getFileName());
        btn.disabled = false;
        btn.innerHTML = originalText;
    }).catch(function (err) {
        console.error('Erro PDF:', err);
        alert('Erro ao gerar PDF: ' + err.message);
        btn.disabled = false;
        btn.innerHTML = originalText;
    });
}

// ===== WHATSAPP =====

function getPhoneNumber() {
    var tel = document.getElementById('telefone').value.replace(/\D/g, '');
    if (tel.length === 0) return null;
    // Adiciona código do país se não tiver
    if (tel.length <= 11) {
        tel = '55' + tel;
    }
    return tel;
}

function buildWhatsAppMessage() {
    var cliente = document.getElementById('cliente').value.trim() || 'Cliente';
    var veiculo = document.getElementById('veiculo').value.trim();
    var placa = document.getElementById('placa').value.trim();
    var total = document.getElementById('total-display').textContent;
    var os = document.getElementById('os').value.trim();

    var msg = '*Auto Pintura Luizinho*\n';
    msg += '━━━━━━━━━━━━━━━━━\n';
    if (os) msg += '*O.S.:* ' + os + '\n';
    msg += '*Cliente:* ' + cliente + '\n';
    if (veiculo) msg += '*Veículo:* ' + veiculo + '\n';
    if (placa) msg += '*Placa:* ' + placa + '\n';
    msg += '\n*Serviços:*\n';

    var items = document.querySelectorAll('.service-item');
    items.forEach(function (item) {
        var desc = item.querySelector('.service-desc').value.trim();
        var val = item.querySelector('.service-value').value.trim();
        if (desc || val) {
            msg += '• ' + (desc || 'Serviço') + (val ? ' - ' + val : '') + '\n';
        }
    });

    msg += '\n*TOTAL: ' + total + '*\n';
    msg += '━━━━━━━━━━━━━━━━━\n';
    msg += '_Orçamento sujeito a alteração após avaliação._';

    return msg;
}

function sendWhatsApp() {
    var phone = getPhoneNumber();
    if (!phone) {
        alert('Preencha o telefone do cliente para enviar pelo WhatsApp.');
        document.getElementById('telefone').focus();
        return;
    }

    var btn = document.querySelector('.btn-whatsapp');
    var originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Gerando PDF...';

    generatePDF().then(function (pdf) {
        // Gera o blob do PDF
        var pdfBlob = pdf.output('blob');
        var message = buildWhatsAppMessage();

        // Tenta usar a Web Share API (funciona bem no mobile)
        if (navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], getFileName(), { type: 'application/pdf' })] })) {
            var file = new File([pdfBlob], getFileName(), { type: 'application/pdf' });
            navigator.share({
                files: [file],
                title: 'Ordem de Serviço',
                text: message
            }).then(function () {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }).catch(function () {
                // Se o share falhou ou foi cancelado, abre o WhatsApp normal
                openWhatsAppLink(phone, message);
                btn.disabled = false;
                btn.innerHTML = originalText;
            });
        } else {
            // Fallback: faz download do PDF e abre WhatsApp com a mensagem
            pdf.save(getFileName());
            openWhatsAppLink(phone, message);
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }).catch(function (err) {
        console.error('Erro WhatsApp PDF:', err);
        alert('Erro ao gerar PDF: ' + err.message);
        btn.disabled = false;
        btn.innerHTML = originalText;
    });
}

function openWhatsAppLink(phone, message) {
    var encoded = encodeURIComponent(message);
    var url = 'https://wa.me/' + phone + '?text=' + encoded;
    window.open(url, '_blank');
}
