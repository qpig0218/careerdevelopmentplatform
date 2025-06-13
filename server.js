const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get('/api/stats', (req, res) => {
  const data = {
    professionals: 6,
    avgExperience: '8+',
    coreFieldsPerPerson: 4.5,
    digitalEnthusiasm: 85,
    chart: [
      { label: 'CBME推動', value: 65, color: 'rgba(98, 100, 167, 0.7)' },
      { label: '數位工具', value: 80, color: 'rgba(0, 120, 212, 0.7)' },
      { label: '醫學人文', value: 75, color: 'rgba(255, 107, 107, 0.7)' },
      { label: '教學行政', value: 90, color: 'rgba(20, 184, 166, 0.7)' },
      { label: '制度設計', value: 70, color: 'rgba(139, 92, 246, 0.7)' },
      { label: '跨域合作', value: 60, color: 'rgba(245, 158, 11, 0.7)' },
      { label: '國際交流', value: 45, color: 'rgba(6, 182, 212, 0.7)' }
    ]
  };
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
