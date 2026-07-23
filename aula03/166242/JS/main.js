document.getElementById('submit-button').addEventListener('click', function() {
    const fields = [
        { id: 'name', name: 'Nome' },
        { id: 'ra', name: 'RA', length: 6 },
        { id: 'birth-date', name: 'Data de Nascimento', length: 10 }, // Inclui as barras
        { id: 'place-birth', name: 'Naturalidade' },
        { id: 'university', name: 'Universidade' },
        { id: 'course', name: 'Curso' },
        { id: 'semesters', name: 'Semestre' }
    ];

    let errors = [];
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input.value) {
            errors.push(`O campo ${field.name} não pode ficar em branco`);
        } else if (field.length && input.value.length !== field.length) {
            errors.push(`O campo ${field.name} deve ter exatamente ${field.length} caracteres`);
        }
    });

    const birthDateInput = document.getElementById('birth-date').value;
    if (!isValidDate(birthDateInput)) {
        errors.push('A Data de Nascimento deve ser uma data válida no formato DD/MM/AAAA');
    }

    if (errors.length > 0) {
        alert(errors.join('\n'));
    } else {
        alert('Formulário submetido com sucesso');
    }
});

document.getElementById('birth-date').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '').slice(0, 8); // Limita a 8 dígitos
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5);
    e.target.value = value;
});

document.getElementById('name').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
});

document.getElementById('place-birth').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
});

document.getElementById('ra').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
});

function updateDateTime() {
    const now = new Date();
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const dayOfWeek = daysOfWeek[now.getDay()];
    const formattedDate = now.toLocaleDateString('pt-BR');
    const formattedTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('date').textContent = `${dayOfWeek}, ${formattedDate} ${formattedTime}`;
}
setInterval(updateDateTime, 1000);

function isValidDate(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}