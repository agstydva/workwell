import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import WorkWellLogo from '../components/WorkWellLogo';
import { useTracker } from '../hooks/useTracker';
import { useAuth } from '../hooks/useAuth';
import { 
  Menu, Play, BookOpen, Clock, Droplet, Dumbbell, Award, ExternalLink, 
  Activity, Heart, X, Sparkles, CheckCircle2, AlertTriangle, HelpCircle,
  Eye, Smile, ShieldAlert, ArrowRight, Shield
} from 'lucide-react';

const WellnessCenter = () => {
  const { isMobileSidebarOpen, setIsMobileSidebarOpen, todayHabit, todayMood, sessionDuration, weeklySessions } = useTracker();
  const { userSettings } = useAuth();

  // Active states for interactive modals
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);
  
  // Quiz states
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const quizPackages = [
    {
      id: 'ergonomics',
      title: 'Ergonomi & Postur Kerja',
      desc: 'Pelajari cara mengatur meja, kursi, posisi monitor, dan posisi mengetik yang benar untuk menghindari cedera fisik.',
      icon: Shield,
      iconColor: 'text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/20',
      difficulty: 'Pemula',
      duration: '3 Menit',
      color: 'emerald',
      questions: [
        {
          id: 1,
          question: "Berapa sudut siku yang disarankan saat mengetik di depan keyboard?",
          options: ["45 derajat", "90 derajat (sejajar meja)", "135 derajat", "Bebas asal tidak kaku"],
          correctAnswerIdx: 1,
          explanation: "Siku sebaiknya membentuk sudut 90 derajat agar otot lengan bawah, pergelangan tangan, dan pundak tidak terbebani secara berlebih saat mengetik."
        },
        {
          id: 2,
          question: "Di manakah letak ujung atas layar monitor yang ideal dibanding posisi mata?",
          options: ["Jauh di atas mata", "Sejajar atau sedikit di bawah tingkat mata", "Sangat rendah agar leher menekuk", "Di samping kiri atau kanan"],
          correctAnswerIdx: 1,
          explanation: "Bagian atas monitor sebaiknya sejajar atau sedikit di bawah mata Anda agar kepala tegak dan otot leher rileks tanpa perlu mendongak atau menunduk."
        },
        {
          id: 3,
          question: "Bagaimana posisi telapak kaki yang benar saat duduk di kursi kerja?",
          options: ["Berjinjit", "Menempel rata di lantai atau sandaran kaki", "Menggantung di udara", "Dilipat di atas kursi"],
          correctAnswerIdx: 1,
          explanation: "Telapak kaki harus menapak rata di lantai untuk menopang berat badan bagian bawah dan mencegah ketegangan pada otot paha belakang serta punggung."
        },
        {
          id: 4,
          question: "Apa bahaya utama menggunakan laptop di atas kasur/sofa tanpa meja secara terus-menerus?",
          options: ["Mengakibatkan cedera leher dan punggung akibat menunduk berlebih", "Membuat laptop cepat dingin", "Mengurangi kekuatan baterai laptop secara drastis", "Merusak warna layar monitor"],
          correctAnswerIdx: 0,
          explanation: "Menggunakan laptop di kasur memaksa tubuh membungkuk dan menunduk dalam waktu lama, yang dapat memicu cedera otot leher, punggung, serta sindrom postur buruk."
        },
        {
          id: 5,
          question: "Setiap berapa menit kita disarankan untuk berdiri dan mengubah posisi tubuh?",
          options: ["Setiap 3-4 jam sekali", "Setiap 30-50 menit sekali", "Cukup saat makan siang saja", "Tidak perlu jika kursi sudah empuk"],
          correctAnswerIdx: 1,
          explanation: "Duduk statis terlalu lama hambat aliran darah. Dianjurkan melakukan gerakan peregangan atau berdiri setiap 30-50 menit sekali untuk menyegarkan otot."
        },
        {
          id: 6,
          question: "Apa fungsi utama dari bantal lumbar (lumbar support) pada kursi kerja?",
          options: ["Sebagai hiasan kursi saja", "Menjaga kelengkungan alami tulang belakang bagian bawah", "Membuat posisi tidur di kursi lebih nyaman", "Meningkatkan tinggi posisi duduk"],
          correctAnswerIdx: 1,
          explanation: "Lumbar support membantu menopang tulang punggung bawah agar tetap melengkung alami (lordosis), mencegah nyeri punggung bawah (LBP)."
        },
        {
          id: 7,
          question: "Bagaimana cara mencegah Carpal Tunnel Syndrome (CTS) saat menggunakan mouse?",
          options: ["Mengetuk mouse sekeras mungkin", "Menggunakan wrist rest (bantalan pergelangan tangan) dan posisi pergelangan lurus", "Menekuk pergelangan tangan ke atas", "Menggunakan jari kelingking untuk klik kiri"],
          correctAnswerIdx: 1,
          explanation: "Menjaga pergelangan tangan tetap lurus dan tidak tertekuk saat menggunakan mouse (atau menggunakan mouse ergonomis vertikal) mengurangi tekanan pada saraf medianus di pergelangan."
        },
        {
          id: 8,
          question: "Berapa jarak ideal mata ke layar monitor komputer?",
          options: ["20 - 30 cm", "50 - 70 cm (sekitar satu panjang lengan)", "100 - 120 cm", "Sedekat mungkin"],
          correctAnswerIdx: 1,
          explanation: "Jarak 50-70 cm adalah jarak optimal bagi mata untuk fokus tanpa memicu ketegangan berlebih pada otot siliaris mata."
        },
        {
          id: 9,
          question: "Saat duduk, posisi paha dan lutut sebaiknya membentuk sudut berapa?",
          options: ["Sekitar 45 derajat", "Sekitar 90 derajat", "Sekitar 150 derajat", "Lutut harus lebih tinggi dari paha"],
          correctAnswerIdx: 1,
          explanation: "Duduk dengan paha sejajar lantai dan lutut membentuk sudut 90 derajat membantu mendistribusikan berat badan secara seimbang pada panggul."
        },
        {
          id: 10,
          question: "Apa yang dimaksud dengan Repetitive Strain Injury (RSI)?",
          options: ["Cedera akibat benturan keras tiba-tiba", "Nyeri otot akibat gerakan berulang tanpa jeda istirahat", "Penurunan daya ingat jangka pendek", "Penyakit kulit akibat radiasi komputer"],
          correctAnswerIdx: 1,
          explanation: "RSI adalah cedera pada otot, tendon, atau saraf akibat gerakan berulang-ulang secara terus-menerus (seperti mengetik tanpa istirahat), menyebabkan peradangan kronis."
        }
      ]
    },
    {
      id: 'eyes',
      title: 'Kesehatan Mata & Batas Layar',
      desc: 'Pahami metode menjaga kesehatan mata Anda, efek radiasi monitor, aturan 20-20-20, serta cara mencegah mata lelah.',
      icon: Eye,
      iconColor: 'text-sky-600 bg-sky-500/10 dark:text-sky-400 dark:bg-sky-500/20',
      difficulty: 'Pemula',
      duration: '3 Menit',
      color: 'sky',
      questions: [
        {
          id: 1,
          question: "Berapa durasi waktu minimal yang disarankan untuk mengistirahatkan mata menurut aturan 20-20-20?",
          options: ["5 detik", "20 detik", "60 detik", "5 menit"],
          correctAnswerIdx: 1,
          explanation: "Aturan 20-20-20 menyarankan untuk menatap objek berjarak 20 kaki (6 meter) selama minimal 20 detik guna memberi kesempatan otot siliaris mata berelaksasi."
        },
        {
          id: 2,
          question: "Apa gejala utama dari Computer Vision Syndrome (CVS)?",
          options: ["Gangguan pendengaran sesaat", "Mata kering, tegang, perih, dan sakit kepala", "Kulit telapak tangan bersisik", "Nyeri hebat pada sendi lutut kaki"],
          correctAnswerIdx: 1,
          explanation: "CVS adalah sekumpulan gejala mata tegang, lelah, kering, merah, pandangan kabur, hingga sakit kepala akibat menatap layar digital terlalu lama."
        },
        {
          id: 3,
          question: "Mengapa frekuensi berkedip kita berkurang drastis saat menatap layar komputer?",
          options: ["Karena mata kita secara otomatis terkunci akibat konsentrasi visual yang tinggi", "Karena radiasi layar menghalangi kelopak mata bergerak", "Karena udara ruangan AC membuat kelopak mata kaku", "Berkedip hanya terjadi saat kita mengantuk"],
          correctAnswerIdx: 0,
          explanation: "Saat fokus menatap layar, konsentrasi visual mengurangi frekuensi berkedip hingga 60%, yang menyebabkan air mata menguap lebih cepat dan memicu mata kering."
        },
        {
          id: 4,
          question: "Apa warna pencahayaan ruangan yang paling disarankan saat bekerja dengan monitor di malam hari?",
          options: ["Gelap gulita tanpa lampu sama sekali", "Penerangan yang cukup dan merata, tidak silau (biasanya warm white)", "Lampu sorot warna-warni yang berkedip", "Lampu ultraviolet khusus"],
          correctAnswerIdx: 1,
          explanation: "Kamar yang gelap gulita saat menatap monitor membuat kontras terlalu ekstrem, memicu mata lelah dengan sangat cepat. Pastikan ruangan cukup terang."
        },
        {
          id: 5,
          question: "Apa efek negatif paparan Blue Light (cahaya biru) monitor di malam hari terhadap tidur?",
          options: ["Membuat tidur menjadi lebih nyenyak dan mimpi indah", "Menekan hormon melatonin sehingga mengganggu siklus tidur (insomnia)", "Menurunkan suhu tubuh dengan drastis saat tidur", "Meningkatkan nafsu makan di pagi hari"],
          correctAnswerIdx: 1,
          explanation: "Cahaya biru dari layar menekan produksi hormon melatonin (hormon tidur), membuat otak mengira hari masih siang sehingga mengacaukan ritme sirkadian tubuh."
        },
        {
          id: 6,
          question: "Berapa tingkat kecerahan layar monitor yang ideal?",
          options: ["Maksimal (100%) agar warna tajam", "Minimal (0%) agar baterai hemat", "Setara dengan tingkat pencahayaan ruangan sekitar (tidak terlalu redup/terang)", "Selalu berubah-ubah setiap detik"],
          correctAnswerIdx: 2,
          explanation: "Kecerahan monitor harus disesuaikan dengan lingkungan sekitar. Jika monitor terasa seperti lampu senter di tempat gelap atau terlalu redup di ruangan terang, berarti setelannya salah."
        },
        {
          id: 7,
          question: "Bagaimana cara termudah meredakan mata kering saat bekerja di ruangan ber-AC?",
          options: ["Menatap layar lebih tajam lagi", "Meneteskan obat tetes mata buatan (artificial tears) dan sering berkedip", "Membasuh mata dengan air hangat berulang kali", "Menutup mata dengan tangan kotor"],
          correctAnswerIdx: 1,
          explanation: "Sering berkedip secara sadar dan menggunakan air mata buatan membantu melumasi kembali permukaan kornea mata yang kering akibat embusan AC."
        },
        {
          id: 8,
          question: "Mengapa filter anti-glare (anti-pantulan) pada layar monitor sangat direkomendasikan?",
          options: ["Untuk mempercepat kinerja prosesor komputer", "Mengurangi pantulan cahaya lampu/jendela yang memicu ketegangan mata", "Agar layar tidak bisa tergores oleh kuku", "Menambah resolusi gambar menjadi 4K"],
          correctAnswerIdx: 1,
          explanation: "Pantulan cahaya pada layar memaksa mata bekerja ekstra keras untuk fokus pada tulisan di monitor, sehingga filter anti-glare sangat membantu mencegah mata lelah."
        },
        {
          id: 9,
          question: "Apa itu presbiopi (mata tua) yang bisa diperparah oleh kelelahan mata digital?",
          options: ["Ketidakmampuan melihat objek dekat dengan jelas", "Gangguan melihat warna merah dan hijau", "Buta total saat malam hari", "Peningkatan tekanan di dalam bola mata"],
          correctAnswerIdx: 0,
          explanation: "Presbiopi adalah penurunan kemampuan fokus mata pada objek dekat secara alami, dan mata lelah akibat paparan layar berlebihan dapat mempercepat kelelahan visual."
        },
        {
          id: 10,
          question: "Berapa jam batas maksimal screen time non-kerja yang disarankan per hari untuk menjaga kesehatan?",
          options: ["Cukup 1-2 jam per hari", "Bebas, asal tidur cukup 8 jam", "Maksimal 10 jam per hari", "Tidak ada batas untuk orang dewasa"],
          correctAnswerIdx: 0,
          explanation: "Di luar waktu kerja wajib, membatasi screen time tambahan hingga 1-2 jam sehari membantu mencegah gaya hidup pasif dan gangguan tidur."
        }
      ]
    },
    {
      id: 'habits',
      title: 'Hidrasi & Kebiasaan Sehat',
      desc: 'Ketahui pentingnya pemenuhan air putih harian, jenis gerakan microbreaks aktif, serta pengaruh dehidrasi bagi fokus kognitif.',
      icon: Droplet,
      iconColor: 'text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/20',
      difficulty: 'Sedang',
      duration: '3 Menit',
      color: 'amber',
      questions: [
        {
          id: 1,
          question: "Mengapa dehidrasi ringan dapat menurunkan produktivitas kerja Anda?",
          options: ["Membuat tangan kita gemetar saat mengetik", "Mengurangi konsentrasi, memicu sakit kepala, dan rasa lelah", "Menurunkan kecepatan internet komputer", "Membuat warna kulit menjadi berubah biru"],
          correctAnswerIdx: 1,
          explanation: "Kekurangan cairan tubuh sebesar 1-2% saja sudah dapat mengganggu fokus otak, memicu kantuk, menurunkan memori jangka pendek, dan menimbulkan pusing kepala."
        },
        {
          id: 2,
          question: "Apa warna urin yang menandakan tubuh Anda terhidrasi dengan sangat baik?",
          options: ["Kuning pekat atau oranye", "Bening transparan atau kuning muda jernih", "Merah muda kemerahan", "Putih susu keruh"],
          correctAnswerIdx: 1,
          explanation: "Warna urin bening transparan atau kuning muda pucat menandakan kadar air di dalam tubuh Anda sudah cukup dan terhidrasi dengan baik."
        },
        {
          id: 3,
          question: "Berapa gelas air mineral yang disarankan untuk diminum setiap jam saat bekerja pasif?",
          options: ["1-2 gelas per jam (sekitar 200-250 ml)", "1 liter sekaligus setiap 4 jam", "Cukup minum jika merasa haus saja", "Setengah gelas saja untuk seharian"],
          correctAnswerIdx: 0,
          explanation: "Minum air secara bertahap (misal 1 gelas tiap 1-2 jam) lebih efektif diserap oleh tubuh dibanding langsung meminum air dalam jumlah sangat besar sekaligus."
        },
        {
          id: 4,
          question: "Apa yang dimaksud dengan peregangan dinamis saat melakukan rehat kerja?",
          options: ["Menahan satu posisi otot selama 1 jam penuh", "Peregangan dengan gerakan aktif berulang untuk melenturkan sendi", "Berlari secepat mungkin di dalam ruangan", "Latihan beban berat di meja kerja"],
          correctAnswerIdx: 1,
          explanation: "Peregangan dinamis melibatkan gerakan aktif (seperti memutar bahu atau kepala secara perlahan) guna melancarkan sirkulasi darah dan melenturkan otot yang kaku."
        },
        {
          id: 5,
          question: "Mengapa konsumsi kopi berlebih saat bekerja justru dapat memicu dehidrasi?",
          options: ["Karena kafein bersifat diuretik (merangsang pembuangan urin)", "Karena rasa kopi yang pahit menyerap air tubuh", "Karena kopi meningkatkan suhu tubuh sehingga berkeringat deras", "Kopi tidak memiliki efek apa pun pada hidrasi"],
          correctAnswerIdx: 0,
          explanation: "Kafein dalam kopi memiliki efek diuretik ringan, yang mendorong ginjal mengeluarkan air lebih cepat melalui urin, sehingga wajib diimbangi dengan air putih."
        },
        {
          id: 6,
          question: "Aktivitas fisik ringan apa yang paling disarankan saat Anda mendapatkan break 5 menit?",
          options: ["Melakukan peregangan leher, bahu, dan berjalan kaki santai", "Melakukan angkat beban berat atau push-up 50 kali", "Bermain game online di HP dengan posisi duduk yang sama", "Tidur telungkup di atas meja kerja"],
          correctAnswerIdx: 0,
          explanation: "Berdiri, memutar bahu/leher, dan melangkah beberapa meter membantu memulihkan aliran darah yang tersumbat di area panggul dan tungkai akibat duduk tegak."
        },
        {
          id: 7,
          question: "Bagaimana asupan air mineral membantu mencegah nyeri sendi saat bekerja?",
          options: ["Air mineral melumasi sendi karena merupakan komponen cairan sinovial", "Air mineral membuat tulang menjadi lentur seperti karet", "Air mineral membilas garam beracun di permukaan kulit sendi", "Air mineral tidak berhubungan dengan persendian"],
          correctAnswerIdx: 0,
          explanation: "Air adalah bahan utama pembentuk cairan sinovial (pelumas sendi). Menjaga hidrasi membantu persendian tetap licin dan terhindar dari gesekan yang memicu nyeri."
        },
        {
          id: 8,
          question: "Apa bahaya jangka panjang dari gaya hidup kurang gerak (sedentary lifestyle) bagi pekerja kantoran?",
          options: ["Meningkatkan risiko penyakit kardiovaskular, diabetes, dan obesitas", "Menyebabkan kerontokan rambut secara instan", "Menurunkan tinggi badan hingga 10 cm", "Tidak ada bahaya selama makan dengan teratur"],
          correctAnswerIdx: 0,
          explanation: "Duduk tanpa jeda gerak harian dalam jangka panjang memperlambat metabolisme tubuh, menumpuk lemak jenuh, dan melipatgandakan risiko penyakit jantung."
        },
        {
          id: 9,
          question: "Apa tips terbaik untuk mengingat minum air mineral saat sibuk bekerja di depan laptop?",
          options: ["Meletakkan botol air besar di meja kerja dan menyetel reminder hidrasi", "Menunggu hingga bibir pecah-pecah baru berjalan ke dapur", "Meminum air hanya saat makan berat saja", "Meminta tolong rekan kerja menyuapi air mineral"],
          correctAnswerIdx: 0,
          explanation: "Menyimpan botol air minum dalam jangkauan mata (visual cue) serta menggunakan aplikasi pengingat (seperti WorkWell) terbukti efektif meningkatkan kebiasaan minum air."
        },
        {
          id: 10,
          question: "Aktivitas rehat manakah yang paling membantu merilekskan sistem saraf dan menurunkan stres kerja?",
          options: ["Melakukan pernapasan dalam diafragma selama 1-2 menit", "Membaca berita politik terbaru di media sosial", "Meminum minuman berenergi tinggi gula", "Berdebat dengan rekan kerja di grup chat"],
          correctAnswerIdx: 0,
          explanation: "Bernapas dalam (inhale-hold-exhale secara teratur) merangsang saraf parasimpatis, lowering heart rate, dan menurunkan hormon stres kortisol dengan cepat."
        }
      ]
    }
  ];

  const activePackage = quizPackages.find(pkg => pkg.id === selectedPackageId);
  const quizQuestions = activePackage ? activePackage.questions : [];
  
  // Exercise Countdown state
  const [exerciseTimeLeft, setExerciseTimeLeft] = useState(0);
  const [exerciseIntervalId, setExerciseIntervalId] = useState(null);

  // Targets
  const limitMinutes = userSettings?.screenLimit || 60;
  const waterTarget = 8;
  const movementTarget = 5;

  // Calculate Today's Screen Time in Minutes
  const todayStr = new Date().toLocaleDateString('sv-SE');
  const todaySessionLog = weeklySessions.find(s => s.date === todayStr) || { screenTime: 0 };
  const savedTimeSeconds = todaySessionLog.screenTime * 60;
  const totalElapsedSeconds = Math.round(savedTimeSeconds + sessionDuration);
  const todayScreenTimeMinutes = totalElapsedSeconds / 60;

  // Calculate Movement (stretches + exercises)
  const stretches = todayHabit?.stretchingCount || 0;
  const exercisesCount = todayHabit?.exerciseCount || 0;
  const totalMovement = stretches + exercisesCount;
  const waterGlasses = todayHabit?.waterIntake || 0;

  // Static Data
  // Static Data with Real YouTube Videos and Real Article Resource Links
  const videos = [
    {
      id: 'Ef6LwAaB3_E',
      title: '5 Min Daily Full Body Stretch',
      description: 'Rutin peregangan seluruh tubuh harian selama 5 menit oleh MadFit untuk meningkatkan fleksibilitas dan kebugaran.',
      duration: '5 Menit',
      difficulty: 'Pemula',
      embedUrl: 'https://www.youtube.com/embed/Ef6LwAaB3_E',
      thumbnail: 'https://img.youtube.com/vi/Ef6LwAaB3_E/hqdefault.jpg'
    },
    {
      id: 'EBxV9YDEtAk',
      title: 'Movement Break for Stationary Jobs',
      description: 'Latihan jeda bergerak yang dirancang untuk mengurangi kaku akibat duduk terlalu lama bekerja.',
      duration: '6 Menit',
      difficulty: 'Pemula',
      embedUrl: 'https://www.youtube.com/embed/EBxV9YDEtAk',
      thumbnail: 'https://img.youtube.com/vi/EBxV9YDEtAk/hqdefault.jpg'
    },
    {
      id: 'T64es5lGZr8',
      title: 'Fast Neck Pain Relief Stretch',
      description: 'Gerakan terapi fisik cepat selama 5 menit untuk meredakan ketegangan dan sakit pada otot leher.',
      duration: '5 Menit',
      difficulty: 'Pemula',
      embedUrl: 'https://www.youtube.com/embed/T64es5lGZr8',
      thumbnail: 'https://img.youtube.com/vi/T64es5lGZr8/hqdefault.jpg'
    },
    {
      id: 'bOXI-wxepmI',
      title: 'Fast Wrist Pain Relief Exercises',
      description: 'Latihan pergelangan tangan yang efektif untuk mengatasi pegal, tendonitis, dan mencegah gejala Carpal Tunnel.',
      duration: '8 Menit',
      difficulty: 'Pemula',
      embedUrl: 'https://www.youtube.com/embed/bOXI-wxepmI',
      thumbnail: 'https://img.youtube.com/vi/bOXI-wxepmI/hqdefault.jpg'
    },
    {
      id: 'p6CMso14NWk',
      title: '20 Min Lower Back Rehab',
      description: 'Program peregangan mendalam dari HASfit khusus rehabilitasi otot pinggang dan punggang bawah.',
      duration: '20 Menit',
      difficulty: 'Sedang',
      embedUrl: 'https://www.youtube.com/embed/p6CMso14NWk',
      thumbnail: 'https://img.youtube.com/vi/p6CMso14NWk/hqdefault.jpg'
    },
    {
      id: 't2NUI7jM4tg',
      title: '3 Stretches to Loosen WFH Stiffness',
      description: 'Tiga gerakan peregangan wajib untuk melenturkan otot yang kaku setelah seharian bekerja dari rumah (WFH).',
      duration: '7 Menit',
      difficulty: 'Semua Tingkat',
      embedUrl: 'https://www.youtube.com/embed/t2NUI7jM4tg',
      thumbnail: 'https://img.youtube.com/vi/t2NUI7jM4tg/hqdefault.jpg'
    }
  ];

  const tips = [
    {
      id: 'tips-1',
      icon: Droplet,
      iconColor: 'text-blue-500 bg-blue-500/10',
      title: 'Stay Hydrated',
      desc: 'Minum air putih setiap 1 jam sekali untuk menjaga hidrasi sel otak, konsentrasi kerja, serta mencegah kelelahan berlebih.'
    },
    {
      id: 'tips-2',
      icon: Eye,
      iconColor: 'text-brand-secondary bg-brand-secondary/10',
      title: '20-20-20 Rule',
      desc: 'Setiap 20 menit bekerja, alihkan mata Anda memandang objek berjarak 20 kaki (6 meter) selama 20 detik untuk mengistirahatkan lensa mata.'
    },
    {
      id: 'tips-3',
      icon: Activity,
      iconColor: 'text-amber-500 bg-amber-500/10',
      title: 'Correct Sitting Posture',
      desc: 'Jaga punggung tetap lurus menempel pada sandaran kursi, tekuk lutut 90 derajat, dan sesuaikan tinggi layar sejajar mata.'
    },
    {
      id: 'tips-4',
      icon: Dumbbell,
      iconColor: 'text-brand-dark bg-brand-dark/10',
      title: 'Take Short Walks',
      desc: 'Berdirilah setiap 1 jam sekali dan berjalan ringan selama 5 menit untuk memulihkan sirkulasi darah vena di kaki Anda.'
    },
    {
      id: 'tips-5',
      icon: Smile,
      iconColor: 'text-rose-500 bg-rose-500/10',
      title: 'Get Enough Sleep',
      desc: 'Tidur berkualitas 7-8 jam per hari membantu menurunkan kadar stres, memperbaiki sel tubuh yang lelah, dan menjaga stabilitas mood.'
    }
  ];

  const articles = [
    {
      id: 'art-1',
      category: 'Ergonomi',
      readTime: '3 Menit',
      title: 'Why Screen Breaks Matter',
      sourceUrl: 'https://www.health.harvard.edu/mind-and-mood/take-a-break-to-save-your-brain-and-body',
      summary: 'Mengapa mengambil jeda istirahat singkat dari layar komputer sangat krusial bagi produktivitas jangka panjang Anda.',
      content: `Mengambil jeda istirahat (screen breaks) bukan sekadar membuang waktu, melainkan strategi mutlak untuk mempertahankan produktivitas. Bekerja terus-menerus tanpa henti memicu kelelahan kognitif (cognitive fatigue) yang menurunkan kemampuan konsentrasi dan meningkatkan rasio kesalahan kerja.
      
      Jeda istirahat singkat (seperti 5 menit setiap jam) memberi kesempatan bagi neurotransmitter di otak untuk memulihkan keseimbangannya. Selain itu, dari sisi fisik, jeda ini menurunkan ketegangan sirkulasi darah dan otot-otot halus pada mata (otot siliaris) yang dipaksa memfokuskan pandangan jarak dekat dalam waktu lama. Jadikan jeda istirahat sebagai bagian rutin dari jadwal kerja harian Anda.`
    },
    {
      id: 'art-2',
      category: 'Kesehatan Fisik',
      readTime: '4 Menit',
      title: 'Effects of Long Screen Time',
      sourceUrl: 'https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/office-ergonomics/art-20046169',
      summary: 'Dampak nyata paparan sinar layar komputer yang berlebihan terhadap kesehatan fisik Anda, mulai dari mata hingga postur tubuh.',
      content: `Menatap monitor selama berjam-jam tanpa jeda memicu serangkaian gangguan kesehatan yang sering diabaikan. Sindrom paling umum adalah Computer Vision Syndrome (CVS) yang ditandai dengan mata kering, merah, gatal, penglihatan kabur, hingga sakit kepala. Hal ini terjadi karena frekuensi berkedip berkurang hingga 60% saat menatap layar.
      
      Secara jangka panjang, duduk tegak dalam posisi statis juga melemahkan otot punggung bagian bawah dan memicu ketegangan leher (text neck syndrome). Kurangnya aktivitas fisik juga menghambat aliran darah balik vena, berpotensi memicu pembengkakan kaki dan menurunkan kesehatan kardiovaskular. Mulailah mengimbangi screen time Anda sekarang.`
    },
    {
      id: 'art-3',
      category: 'Mental Wellness',
      readTime: '4 Menit',
      title: 'Managing Workplace Stress',
      sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work',
      summary: 'Tips praktis mengelola stres psikologis di lingkungan kerja digital agar terhindar dari burnout.',
      content: `Stres di tempat kerja digital sering kali disebabkan oleh banjir informasi (information overload), notifikasi yang konstan, dan batasan kerja yang buram. Untuk mengelolanya, terapkan batasan waktu kerja yang jelas (digital boundary) dan buat prioritas tugas secara terstruktur.
      
      Ketika merasakan kecemasan atau stres mulai memuncak, luangkan waktu 2 menit untuk melakukan latihan pernapasan dalam (deep breathing). Latihan ini merangsang saraf parasimpatis untuk menurunkan denyut jantung dan tekanan darah secara instan, membawa sinyal ketenangan kembali ke otak Anda. Hindari multitasking berlebih demi menjaga ketenangan pikiran.`
    },
    {
      id: 'art-4',
      category: 'Kebiasaan Baik',
      readTime: '5 Menit',
      title: 'Building Healthy Habits',
      sourceUrl: 'https://www.health.harvard.edu/staying-healthy/the-science-of-habit-building',
      summary: 'Panduan psikologis sederhana untuk menanamkan kebiasaan sehat baru ke dalam rutinitas kerja harian Anda.',
      content: `Membangun kebiasaan baru memerlukan strategi pengkondisian (habit loop) yang konsisten. Salah satu teknik termudah adalah 'habit stacking', yaitu menempelkan kebiasaan baru di atas kebiasaan lama yang sudah mapan. Sebagai contoh: 'Setelah saya menutup panggilan rapat video, saya akan langsung minum segelas air putih.'
      
      Mulailah dengan langkah kecil yang tidak membebani mental Anda. Mengonsumsi 4 gelas air sehari jauh lebih mudah dimulai daripada langsung menargetkan 10 gelas. Gunakan WorkWell untuk memonitor progres Anda setiap hari dan berikan apresiasi pada diri sendiri ketika berhasil menjaga streak harian.`
    },
    {
      id: 'art-5',
      category: 'Fisioterapi',
      readTime: '3 Menit',
      title: 'Benefits of Daily Stretching',
      sourceUrl: 'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931',
      summary: 'Bagaimana peregangan otot harian secara teratur dapat mencegah cedera otot kronis akibat duduk statis.',
      content: `Duduk secara konstan menempatkan otot-otot panggul (hip flexors), punggung, dan dada pada kondisi memendek dan tegang, sementara otot punggung atas memanjang dan melemah. Ketidakseimbangan biomekanik ini memicu rasa pegal kronis.
      
      Peregangan harian (stretching) membantu memperlancar kembali aliran darah kapiler ke dalam otot, membuang sisa metabolisme asam laktat yang memicu pegal, serta menjaga kelenturan sendi. Melakukan peregangan leher, pergelangan tangan, dan bahu selama 3-5 menit sehari secara drastis menurunkan risiko cedera kerja kronis.`
    }
  ];

  const exercises = [
    {
      id: 'breathing',
      title: 'Deep Breathing',
      desc: 'Latihan pernapasan dalam metode kotak (Box Breathing) untuk meredakan kecemasan dan stres kerja secara instan.',
      duration: '2 Menit',
      totalSeconds: 120
    },
    {
      id: 'eye',
      title: 'Eye Relaxation',
      desc: 'Relaksasikan otot lensa mata yang kaku dan kurangi ketegangan akibat radiasi layar monitor.',
      duration: '1 Menit',
      totalSeconds: 60
    },
    {
      id: 'stretch',
      title: 'Desk Stretch',
      desc: 'Panduan peregangan 5 langkah sederhana dari leher hingga dada untuk melancarkan sirkulasi otot.',
      duration: '5 Menit',
      totalSeconds: 300
    }
  ];

  const [shuffledVideos] = useState(() => [...videos].sort(() => 0.5 - Math.random()));
  const [shuffledArticles] = useState(() => [...articles].sort(() => 0.5 - Math.random()));

  // Handle active exercise countdown
  const startExercise = (exercise) => {
    // Clear any active timers first
    if (exerciseIntervalId) {
      clearInterval(exerciseIntervalId);
    }
    
    setActiveExercise(exercise);
    setExerciseTimeLeft(exercise.totalSeconds);

    const interval = setInterval(() => {
      setExerciseTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setExerciseIntervalId(interval);
  };

  const closeExercise = () => {
    if (exerciseIntervalId) {
      clearInterval(exerciseIntervalId);
      setExerciseIntervalId(null);
    }
    setActiveExercise(null);
    setExerciseTimeLeft(0);
  };

  // Quiz Handlers
  const handleStartQuiz = (pkgId) => {
    if (pkgId && typeof pkgId === 'string') setSelectedPackageId(pkgId);
    setQuizStarted(true);
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setShowFeedback(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleSelectOption = (idx) => {
    if (showFeedback) return;
    setSelectedOptionIdx(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIdx === null || showFeedback) return;
    
    const currentQuestion = quizQuestions[currentQuestionIdx];
    if (selectedOptionIdx === currentQuestion.correctAnswerIdx) {
      setScore(prev => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setSelectedOptionIdx(null);
    setShowFeedback(false);
    
    if (currentQuestionIdx + 1 < quizQuestions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setSelectedPackageId(null);
    setQuizStarted(false);
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setShowFeedback(false);
    setScore(0);
    setQuizFinished(false);
  };

  useEffect(() => {
    return () => {
      if (exerciseIntervalId) clearInterval(exerciseIntervalId);
    };
  }, [exerciseIntervalId]);

  // Scroll Reveal Observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // Breathing Visual State calculation
  const getBreathingState = () => {
    if (!activeExercise || activeExercise.id !== 'breathing') return null;
    const elapsed = activeExercise.totalSeconds - exerciseTimeLeft;
    const cycle = elapsed % 12; // 12 seconds per full cycle
    
    if (cycle < 4) {
      return { text: 'Tarik Napas...', scale: 'scale-135 bg-brand-primary/45 border-brand-primary/50' };
    } else if (cycle < 8) {
      return { text: 'Tahan Napas...', scale: 'scale-135 bg-brand-secondary/35 border-brand-secondary/40' };
    } else {
      return { text: 'Hembuskan Napas...', scale: 'scale-100 bg-brand-primary/20 border-brand-primary/30' };
    }
  };

  // Eye relaxation instruction state calculation
  const getEyeState = () => {
    if (!activeExercise || activeExercise.id !== 'eye') return null;
    const elapsed = activeExercise.totalSeconds - exerciseTimeLeft;
    
    if (elapsed < 20) {
      return { step: 'Langkah 1/3', text: 'Tutup mata Anda rapat-rapat dan rilekskan otot kelopak mata sepenuhnya.' };
    } else if (elapsed < 40) {
      return { step: 'Langkah 2/3', text: 'Buka mata lebar-lebar dan kedipkan mata Anda secara cepat beberapa kali.' };
    } else {
      return { step: 'Langkah 3/3', text: 'Alihkan pandangan Anda menatap jauh ke luar jendela atau sudut terjauh ruangan.' };
    }
  };

  // Desk stretch guide steps state calculation
  const getStretchState = () => {
    if (!activeExercise || activeExercise.id !== 'stretch') return null;
    const elapsed = activeExercise.totalSeconds - exerciseTimeLeft;
    const stepIdx = Math.floor(elapsed / 60); // 5 steps, 60s each
    
    const steps = [
      { step: 'Langkah 1/5: Peregangan Leher', text: 'Miringkan kepala Anda ke kanan secara perlahan hingga terasa regang di leher kiri, tahan. Lakukan hal yang sama ke arah kiri.' },
      { step: 'Langkah 2/5: Peregangan Bahu', text: 'Putar bahu Anda ke depan sebanyak 10 kali, lalu ke belakang sebanyak 10 kali untuk mengendurkan persendian.' },
      { step: 'Langkah 3/5: Peregangan Pergelangan', text: 'Luruskan tangan ke depan, tarik telapak tangan ke belakang menggunakan tangan lainnya secara bergantian untuk membebaskan saraf pergelangan.' },
      { step: 'Langkah 4/5: Peregangan Punggung', text: 'Duduk tegak, kaitkan kedua tangan di belakang kepala, lalu putar tubuh bagian atas ke kanan sejauh mungkin, tahan. Putar kembali ke kiri.' },
      { step: 'Langkah 5/5: Peregangan Dada', text: 'Busungkan dada Anda ke depan lebar-lebar sambil menarik kedua siku tangan ke arah belakang untuk merapikan postur dada.' }
    ];

    return steps[Math.min(4, stepIdx)] || steps[4];
  };

  // Generate dynamic recommendation card list based on real tracked habits
  const getDailyRecommendations = () => {
    const recs = [];

    // Screen Time limit check
    if (todayScreenTimeMinutes > limitMinutes) {
      recs.push({
        id: 'rec-screen',
        type: 'warning',
        icon: ShieldAlert,
        iconColor: 'text-rose-500 bg-rose-500/10',
        text: `Your screen time is above average (${Math.round(todayScreenTimeMinutes)}m / ${limitMinutes}m). Consider taking a 10-minute walk.`
      });
    } else {
      recs.push({
        id: 'rec-screen-ok',
        type: 'success',
        icon: CheckCircle2,
        iconColor: 'text-emerald-500 bg-emerald-500/10',
        text: `Your screen time is under control (${Math.round(todayScreenTimeMinutes)}m / ${limitMinutes}m). Great work maintaining healthy work limits!`
      });
    }

    // Hydration check
    if (waterGlasses < 6) {
      recs.push({
        id: 'rec-water',
        type: 'danger',
        icon: AlertTriangle,
        iconColor: 'text-amber-500 bg-amber-500/10',
        text: `You have only consumed ${waterGlasses} glasses of water today. Drink more water to stay hydrated.`
      });
    } else {
      recs.push({
        id: 'rec-water-ok',
        type: 'success',
        icon: CheckCircle2,
        iconColor: 'text-emerald-500 bg-emerald-500/10',
        text: `You completed your hydration goal today (${waterGlasses} / 8 glasses). Excellent job staying hydrated!`
      });
    }

    // Movement count check
    if (totalMovement < 3) {
      recs.push({
        id: 'rec-movement',
        type: 'danger',
        icon: AlertTriangle,
        iconColor: 'text-amber-500 bg-amber-500/10',
        text: `Physical stretching sessions are low (${totalMovement} sessions logged). Consider doing some quick desk stretches.`
      });
    } else {
      recs.push({
        id: 'rec-movement-ok',
        type: 'success',
        icon: CheckCircle2,
        iconColor: 'text-emerald-500 bg-emerald-500/10',
        text: `You completed your movement goal today (${totalMovement} / ${movementTarget} sessions). Great job!`
      });
    }

    return recs;
  };

  const recommendations = getDailyRecommendations();

  // Helper to format countdown timer string (MM:SS)
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col transition-colors duration-200">
      <style dangerouslySetInnerHTML={{
        __html: `
        .scroll-reveal {
          opacity: 0;
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }
        .reveal-up {
          transform: translateY(30px);
        }
        .reveal-left {
          transform: translateX(-30px);
        }
        .reveal-right {
          transform: translateX(30px);
        }
        .reveal-active {
          opacity: 1 !important;
          transform: translate(0) !important;
        }
      `}} />
      
      {/* Mobile Header (Hamburger drawer trigger) */}
      <div className="flex md:hidden items-center justify-between px-6 py-4 bg-white border-b border-brand-secondary/15 dark:bg-slate-950">
        <WorkWellLogo logoColorClass="text-brand-dark dark:text-white" />
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white focus:outline-none cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Learning Center Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-12">
          
          {/* Header Dashboard Title */}
          <div className="pb-4 border-b border-brand-secondary/15 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 scroll-reveal reveal-up">
            <div>
              <h1 className="text-2xl font-black text-brand-dark leading-tight flex items-center space-x-2">
                <span>Wellness Center</span>
              </h1>
              <p className="text-xs text-brand-secondary mt-1 font-semibold">
                Learn healthy habits to improve your productivity and wellbeing.
              </p>
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-brand-secondary/10 text-brand-dark dark:text-white border border-brand-secondary/25 rounded-2xl text-[10px] font-bold shadow-sm">
              <Sparkles className="h-4 w-4 text-brand-secondary animate-pulse" />
              <span>Digital Health Center</span>
            </div>
          </div>

          {/* ========================================================
              SECTION 5: DAILY RECOMMENDATION (PERSONAL REPORT CARD)
              ======================================================== */}
          <section className="space-y-4 text-left scroll-reveal reveal-up">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-brand-secondary" />
              <h2 className="text-base font-black text-brand-dark uppercase tracking-wider">Daily Recommendation</h2>
            </div>
            
            <div className="glass-panel p-6 rounded-3xl border border-brand-secondary/15 space-y-4">
              <p className="text-xs text-brand-secondary font-semibold leading-relaxed">
                Based on your daily activity tracking logs, our wellness assistant recommends:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map((rec) => {
                  const Icon = rec.icon;
                  return (
                    <div key={rec.id} className="p-4 bg-brand-bg/40 border border-brand-secondary/10 rounded-2xl flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
                      <div className={`p-2 rounded-xl ${rec.iconColor} flex-shrink-0`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <p className="text-[11px] text-brand-dark font-semibold leading-relaxed">{rec.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ========================================================
              SECTION 4: QUICK WELLNESS EXERCISES (INTERACTIVE TIMERS)
              ======================================================== */}
          <section className="space-y-4 text-left scroll-reveal reveal-up">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-brand-secondary" />
              <h2 className="text-base font-black text-brand-dark uppercase tracking-wider">Quick Wellness Exercises</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.map((ex) => (
                <div key={ex.id} className="glass-card-light p-6 rounded-3xl border border-brand-secondary/12 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest">Exercise</span>
                      <span className="px-2.5 py-1 bg-brand-secondary/10 text-brand-secondary rounded-lg text-[9px] font-extrabold">{ex.duration}</span>
                    </div>
                    <h3 className="text-base font-black text-brand-dark">{ex.title}</h3>
                    <p className="text-xs text-brand-secondary font-medium leading-relaxed">{ex.desc}</p>
                  </div>

                  <button
                    onClick={() => startExercise(ex)}
                    className="w-full mt-5 py-3 px-4 bg-brand-secondary hover:bg-brand-secondary/95 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-brand-secondary/10 hover:shadow-brand-secondary/20 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{ex.id === 'breathing' ? 'Start Exercise' : 'Start'}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================
              SECTION 1: FEATURED STRETCHING VIDEOS
              ======================================================== */}
          <section className="space-y-4 text-left scroll-reveal reveal-up">
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-brand-secondary" />
              <h2 className="text-base font-black text-brand-dark uppercase tracking-wider">Featured Stretching Videos</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shuffledVideos.map((vid) => (
                <div key={vid.id} className="glass-panel rounded-3xl overflow-hidden border border-brand-secondary/12 flex flex-col hover:shadow-lg transition-all duration-300">
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center group cursor-pointer" onClick={() => setActiveVideo(vid)}>
                    <img 
                      src={vid.thumbnail || `https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`} 
                      alt={vid.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />
                    <div className="absolute w-12 h-12 rounded-full bg-white/90 shadow-md flex items-center justify-center text-brand-dark transform group-hover:scale-110 transition-transform">
                      <Play className="h-5 w-5 fill-current text-brand-secondary ml-0.5" />
                    </div>
                  </div>

                  {/* Details Card info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-bold">
                        <span className="px-2 py-0.5 bg-brand-primary/15 text-brand-dark dark:text-brand-primary rounded-md uppercase tracking-wider">{vid.difficulty}</span>
                        <span className="text-brand-secondary flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{vid.duration}</span>
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-brand-dark line-clamp-1">{vid.title}</h3>
                      <p className="text-xs text-brand-secondary font-medium leading-relaxed line-clamp-2">{vid.description}</p>
                    </div>

                    <button
                      onClick={() => setActiveVideo(vid)}
                      className="w-full py-2.5 px-4 bg-brand-primary hover:bg-brand-primary/95 text-brand-dark font-black rounded-xl text-[11px] transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>Watch Video</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================
              SECTION 3: EDUCATIONAL ARTICLES (HEALTH LESSONS)
              ======================================================== */}
          <section className="space-y-4 text-left scroll-reveal reveal-up">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-brand-secondary" />
              <h2 className="text-base font-black text-brand-dark uppercase tracking-wider">Educational Articles</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shuffledArticles.map((art, idx) => {
                // Get a relevant image for the category
                const imgUrls = {
                  'Ergonomi': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=60', // office desk
                  'Kesehatan Fisik': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=60', // stretching/yoga
                  'Mental Wellness': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=60', // calm/meditation
                  'Kebiasaan Baik': 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=600&auto=format&fit=crop&q=60', // glass of water/habits
                  'Fisioterapi': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=60' // gym/exercise/stretch
                };
                const bgImg = imgUrls[art.category] || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=60';
                
                return (
                  <div key={art.id} className="glass-panel rounded-3xl overflow-hidden border border-brand-secondary/12 flex flex-col hover:shadow-lg transition-all duration-300 text-left">
                    {/* Thumbnail Image */}
                    <div className="h-36 relative overflow-hidden group cursor-pointer" onClick={() => setActiveArticle(art)}>
                      <img 
                        src={bgImg} 
                        alt={art.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
                      
                      <span className="absolute top-4 left-4 px-2.5 py-1 bg-white/90 text-brand-dark rounded-xl text-[9px] font-extrabold shadow-sm">{art.category}</span>
                      
                      <div className="absolute bottom-4 left-4 flex items-center space-x-1 text-[9px] font-black text-white bg-black/40 backdrop-blur-sm w-fit px-2 py-0.5 rounded-lg">
                        <Clock className="h-3 w-3" />
                        <span>{art.readTime} Read</span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-black text-brand-dark line-clamp-1">{art.title}</h3>
                        <p className="text-xs text-brand-secondary font-medium leading-relaxed line-clamp-2">{art.summary}</p>
                      </div>

                      <button
                        onClick={() => setActiveArticle(art)}
                        className="w-fit py-2.5 px-4 bg-brand-secondary/10 hover:bg-brand-secondary/15 text-brand-secondary font-black rounded-xl text-[11px] transition-all flex items-center justify-center cursor-pointer"
                      >
                        <span>Read More</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ========================================================
              SECTION 2: HEALTHY TIPS (TIP CARDS GRID)
              ======================================================== */}
          <section className="space-y-4 text-left scroll-reveal reveal-up">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-brand-secondary" />
              <h2 className="text-base font-black text-brand-dark uppercase tracking-wider">Healthy Tips</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tips.map((tip) => {
                const Icon = tip.icon;
                return (
                  <div key={tip.id} className="glass-card-light p-6 rounded-3xl border border-brand-secondary/12 flex items-start space-x-4 hover:shadow-md transition-all duration-300">
                    <div className={`p-3 rounded-2xl ${tip.iconColor} flex-shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <h3 className="text-xs font-black uppercase tracking-wider text-brand-dark">{tip.title}</h3>
                      <p className="text-[11px] text-brand-secondary font-semibold leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ========================================================
              SECTION 7: INTERACTIVE WELLNESS QUIZ
              ======================================================== */}
          <section className="space-y-4 text-left scroll-reveal reveal-up">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-brand-secondary" />
              <h2 className="text-base font-black text-brand-dark uppercase tracking-wider">Interactive Wellness Quiz</h2>
            </div>
            <div className="glass-panel p-6 sm:p-8 rounded-[32px] border border-brand-secondary/15 space-y-6">
              {!selectedPackageId ? (
                // 1. Welcome / Start Screen with 3 packages selection
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center shadow-inner">
                      <HelpCircle className="h-7 w-7" />
                    </div>
                    <div className="space-y-2 max-w-lg">
                      <h3 className="text-lg font-black text-brand-dark">Asah Wawasan Kebugaran Digital Anda</h3>
                      <p className="text-xs text-brand-secondary font-medium leading-relaxed">
                        Pilih salah satu topik tantangan di bawah ini untuk menguji pemahaman praktis Anda. Mari bangun kebiasaan bekerja yang lebih sehat, nyaman, dan bebas pegal!
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    {quizPackages.map((pkg) => {
                      const PkgIcon = pkg.icon;
                      return (
                        <div 
                          key={pkg.id} 
                          className="glass-card-light p-6 rounded-[28px] border border-brand-secondary/12 hover:border-brand-primary/30 flex flex-col justify-between hover:shadow-xl transition-all duration-300 text-left group"
                        >
                          <div className="space-y-4">
                            <div className={`p-3 w-fit rounded-2xl ${pkg.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                              <PkgIcon className="h-6 w-6" />
                            </div>
                            <div className="space-y-1.5">
                              <h4 className="text-sm font-black text-brand-dark">{pkg.title}</h4>
                              <p className="text-[11px] text-brand-secondary leading-relaxed font-semibold">
                                {pkg.desc}
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-brand-secondary">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">{pkg.difficulty}</span>
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">{pkg.duration}</span>
                              <span className="px-2 py-0.5 rounded-full bg-brand-secondary/10 text-brand-secondary">10 Soal</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPackageId(pkg.id);
                                setQuizStarted(true);
                                setCurrentQuestionIdx(0);
                                setSelectedOptionIdx(null);
                                setShowFeedback(false);
                                setScore(0);
                                setQuizFinished(false);
                              }}
                              className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-brand-dark font-extrabold rounded-2xl text-xs transition-all shadow-md shadow-brand-primary/10 cursor-pointer text-center"
                            >
                              Mulai Kuis
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : quizFinished ? (
                // 2. Quiz Finished / Results Screen
                <div className="flex flex-col items-center text-center space-y-6 py-4 animate-in zoom-in-95 duration-300">
                  {/* Score circle */}
                  <div className="relative w-28 h-28 rounded-full bg-brand-primary/10 border-4 border-brand-primary flex flex-col items-center justify-center shadow-lg">
                    <span className="text-3xl font-black text-brand-dark">{Math.round((score / quizQuestions.length) * 100)}%</span>
                    <span className="text-[10px] text-brand-secondary font-bold uppercase tracking-wider mt-0.5">{score} / {quizQuestions.length} Benar</span>
                  </div>

                  <div className="space-y-2 max-w-md">
                    <h3 className="text-lg font-black text-brand-dark">
                      {score === quizQuestions.length 
                        ? 'Luar Biasa! Kuis Selesai' 
                        : score >= 7 
                        ? 'Kerja Bagus! Kuis Selesai' 
                        : 'Kuis Selesai! Tetap Semangat'}
                    </h3>
                    <p className="text-xs text-brand-secondary font-semibold leading-relaxed">
                      {score === quizQuestions.length
                        ? `Anda memahami dengan sempurna seluruh materi kuis "${activePackage?.title}" ini! Pertahankan pengetahuan Anda.`
                        : score >= 7
                        ? `Pemahaman Anda mengenai kuis "${activePackage?.title}" sangat bagus. Anda sudah siap mempraktikkannya sehari-hari.`
                        : `Kuis selesai! Mari tingkatkan lagi pemahaman Anda tentang "${activePackage?.title}" dengan membaca ulang penjelasan detail kuis.`}
                    </p>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPackageId(null)}
                      className="py-3 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold rounded-2xl text-xs transition-all cursor-pointer"
                    >
                      Pilih Paket Lain
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuizStarted(true);
                        setCurrentQuestionIdx(0);
                        setSelectedOptionIdx(null);
                        setShowFeedback(false);
                        setScore(0);
                        setQuizFinished(false);
                      }}
                      className="py-3 px-6 bg-brand-primary hover:bg-brand-primary/95 text-brand-dark font-extrabold rounded-2xl text-xs transition-all shadow-md shadow-brand-primary/10 cursor-pointer"
                    >
                      Coba Lagi
                    </button>
                  </div>
                </div>
              ) : (
                // 3. Active Quiz Question Screen
                <div className="space-y-6 animate-in fade-in duration-200 text-left">
                  {/* Exit button and Package Info */}
                  <div className="flex items-center justify-between pb-2 border-b border-brand-secondary/10">
                    <button 
                      onClick={() => setSelectedPackageId(null)}
                      className="text-xs font-bold text-slate-500 hover:text-brand-secondary flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>← Kembali ke Menu Paket</span>
                    </button>
                    <span className="text-[10px] font-extrabold text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {activePackage?.title}
                    </span>
                  </div>

                  {/* Progress Bar & Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest">
                      Pertanyaan {currentQuestionIdx + 1} dari {quizQuestions.length}
                    </span>
                    <div className="w-full sm:w-48 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-primary transition-all duration-300"
                        style={{ width: `${((currentQuestionIdx + 1) / quizQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <h3 className="text-sm font-black text-brand-dark leading-snug">
                    {quizQuestions[currentQuestionIdx]?.question || ''}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-3">
                    {(quizQuestions[currentQuestionIdx]?.options || []).map((opt, idx) => {
                      const isSelected = selectedOptionIdx === idx;
                      const isCorrectAnswer = idx === quizQuestions[currentQuestionIdx]?.correctAnswerIdx;
                      
                      let optionStyle = "border-slate-200 bg-slate-50/30 hover:bg-slate-55/60 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:bg-slate-900/60";
                      
                      if (showFeedback) {
                        if (isCorrectAnswer) {
                          optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-extrabold";
                        } else if (isSelected) {
                          optionStyle = "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-extrabold";
                        } else {
                          optionStyle = "border-slate-200/50 bg-slate-50/10 opacity-60 dark:border-slate-800/50 dark:bg-slate-900/10";
                        }
                      } else if (isSelected) {
                        optionStyle = "border-brand-secondary bg-brand-secondary/10 text-brand-secondary font-extrabold";
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full py-3.5 px-5 border text-left text-xs font-semibold rounded-2xl transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                          disabled={showFeedback}
                        >
                          <span>{opt}</span>
                          {showFeedback && isCorrectAnswer && (
                            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          )}
                          {showFeedback && isSelected && !isCorrectAnswer && (
                            <X className="h-4.5 w-4.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation Card */}
                  {showFeedback && (
                    <div className="p-4 bg-brand-secondary/5 border border-brand-secondary/10 rounded-2xl text-left space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center space-x-1.5 text-brand-secondary font-bold text-[10px] uppercase tracking-wider">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Penjelasan Edukatif</span>
                      </div>
                      <p className="text-[11px] text-brand-secondary font-medium leading-relaxed">
                        {quizQuestions[currentQuestionIdx]?.explanation || ''}
                      </p>
                    </div>
                  )}

                  {/* Actions (Kirim Jawaban / Lanjut) */}
                  <div className="flex justify-end pt-2">
                    {!showFeedback ? (
                      <button
                        type="button"
                        onClick={handleSubmitAnswer}
                        disabled={selectedOptionIdx === null}
                        className="py-3 px-8 bg-brand-primary hover:bg-brand-primary/95 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-transparent text-brand-dark font-extrabold rounded-2xl text-xs transition-all shadow-md shadow-brand-primary/10 cursor-pointer"
                      >
                        Kirim Jawaban
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="py-3 px-8 bg-brand-secondary hover:bg-brand-secondary/95 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md shadow-brand-secondary/15 cursor-pointer flex items-center space-x-1.5"
                      >
                        <span>
                          {currentQuestionIdx + 1 === quizQuestions.length ? 'Lihat Hasil' : 'Pertanyaan Selanjutnya'}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ========================================================
              SECTION 6: HEALTH RESOURCES (USEFUL LINKS)
              ======================================================== */}
          <section className="space-y-4 text-left scroll-reveal reveal-up">
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-5 w-5 text-brand-secondary" />
              <h2 className="text-base font-black text-brand-dark uppercase tracking-wider">Health Resources</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <a 
                href="https://www.who.int/publications/i/item/who-healthy-workplaces-a-model-for-action"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-light p-4 rounded-2xl border border-brand-secondary/12 flex items-center justify-between group hover:border-brand-secondary/30 transition-all duration-300"
              >
                <div className="text-left">
                  <span className="text-[9px] font-extrabold text-brand-secondary uppercase block">WHO Guidelines</span>
                  <span className="text-[11px] font-black text-brand-dark block mt-0.5">Healthy Workplace</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-secondary transition-colors" />
              </a>

              <a 
                href="https://www.who.int/publications/i/item/9789240015128"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-light p-4 rounded-2xl border border-brand-secondary/12 flex items-center justify-between group hover:border-brand-secondary/30 transition-all duration-300"
              >
                <div className="text-left">
                  <span className="text-[9px] font-extrabold text-brand-secondary uppercase block">WHO Guidelines</span>
                  <span className="text-[11px] font-black text-brand-dark block mt-0.5">Physical Activity</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-secondary transition-colors" />
              </a>

              <a 
                href="https://www.health.harvard.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-light p-4 rounded-2xl border border-brand-secondary/12 flex items-center justify-between group hover:border-brand-secondary/30 transition-all duration-300"
              >
                <div className="text-left">
                  <span className="text-[9px] font-extrabold text-brand-secondary uppercase block">Harvard University</span>
                  <span className="text-[11px] font-black text-brand-dark block mt-0.5">Harvard Health</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-secondary transition-colors" />
              </a>

              <a 
                href="https://www.mayoclinic.org/healthy-lifestyle"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-light p-4 rounded-2xl border border-brand-secondary/12 flex items-center justify-between group hover:border-brand-secondary/30 transition-all duration-300"
              >
                <div className="text-left">
                  <span className="text-[9px] font-extrabold text-brand-secondary uppercase block">Mayo Clinic</span>
                  <span className="text-[11px] font-black text-brand-dark block mt-0.5">Healthy Living</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-secondary transition-colors" />
              </a>
            </div>
          </section>

        </main>
      </div>

      {/* ========================================================
          INTERACTIVE POPUP MODALS
          ======================================================== */}

      {/* 1. Modal Video Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setActiveVideo(null)} />
          
          <div className="bg-white border border-brand-secondary/15 w-full max-w-3xl rounded-[32px] overflow-hidden shadow-2xl relative z-10 space-y-4 animate-in fade-in zoom-in-95 duration-200 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center pb-2 border-b border-brand-secondary/10">
              <div className="text-left">
                <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider">{activeVideo.title}</h3>
                <p className="text-[10px] text-brand-secondary font-semibold mt-0.5">Duration: {activeVideo.duration} • Difficulty: {activeVideo.difficulty}</p>
              </div>
              <button 
                onClick={() => setActiveVideo(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-md">
              <iframe
                title={activeVideo.title}
                src={activeVideo.embedUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Article Reader */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setActiveArticle(null)} />
          
          <div className="bg-white border border-brand-secondary/15 w-full max-w-2xl rounded-[32px] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-brand-secondary/10">
              <div className="text-left space-y-1 pr-8">
                <span className="px-2 py-0.5 bg-brand-secondary/15 text-brand-secondary rounded-md text-[9px] font-extrabold uppercase tracking-wider">{activeArticle.category}</span>
                <h3 className="text-lg font-black text-brand-dark mt-1 leading-tight">{activeArticle.title}</h3>
                <p className="text-[10px] text-brand-secondary font-semibold">Reading time: {activeArticle.readTime}</p>
              </div>
              <button 
                onClick={() => setActiveArticle(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="text-left text-xs font-semibold text-slate-650 leading-relaxed py-6 space-y-4 flex-1">
              {activeArticle.content.split('\n\n').map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-brand-secondary/10 flex justify-between items-center">
              {activeArticle.sourceUrl && (
                <a
                  href={activeArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 text-xs font-bold text-brand-secondary hover:underline cursor-pointer"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Kunjungi Sumber Artikel</span>
                </a>
              )}
              <button
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 bg-brand-secondary hover:bg-brand-secondary/95 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Interactive Exercise Overlay (Breathing / Stretching Counters) */}
      {activeExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-md" />
          
          <div className="bg-white border border-brand-secondary/15 w-full max-w-md rounded-[32px] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 p-8 flex flex-col justify-between items-center text-center space-y-8">
            {/* Header info */}
            <div className="flex justify-between items-center w-full pb-3 border-b border-brand-secondary/10">
              <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider">Exercise: {activeExercise.title}</h3>
              <button 
                onClick={closeExercise}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Interactive Guide View */}
            <div className="flex-1 py-6 flex flex-col items-center justify-center space-y-8 w-full min-h-[220px]">
              
              {/* Exercise Type 1: Deep Breathing */}
              {activeExercise.id === 'breathing' && (() => {
                const breathing = getBreathingState();
                return (
                  <div className="flex flex-col items-center space-y-8">
                    {/* Breathing circle indicator */}
                    <div className="relative flex items-center justify-center w-40 h-40">
                      <div className={`w-28 h-28 rounded-full border-4 border-dashed transition-all duration-[4000ms] ease-in-out ${breathing.scale}`} />
                      <span className="absolute text-xl font-black text-brand-dark">🧘</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-brand-dark transition-all duration-300">{breathing.text}</h4>
                      <p className="text-[10px] text-brand-secondary font-semibold">Tarik 4 detik, tahan 4 detik, embuskan 4 detik</p>
                    </div>
                  </div>
                );
              })()}

              {/* Exercise Type 2: Eye Relaxation */}
              {activeExercise.id === 'eye' && (() => {
                const eyeState = getEyeState();
                return (
                  <div className="flex flex-col items-center space-y-6 max-w-xs mx-auto">
                    <div className="w-20 h-20 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-3xl animate-bounce">
                      👁️
                    </div>
                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 bg-brand-secondary/15 text-brand-secondary rounded-full text-[9px] font-black uppercase tracking-wider">{eyeState.step}</span>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed">{eyeState.text}</p>
                    </div>
                  </div>
                );
              })()}

              {/* Exercise Type 3: Desk Stretch */}
              {activeExercise.id === 'stretch' && (() => {
                const stretchState = getStretchState();
                return (
                  <div className="flex flex-col items-center space-y-6 max-w-xs mx-auto">
                    <div className="w-20 h-20 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-3xl animate-bounce">
                      💪
                    </div>
                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 bg-brand-secondary/15 text-brand-secondary rounded-full text-[9px] font-black uppercase tracking-wider">{stretchState.step}</span>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed">{stretchState.text}</p>
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Timer Countdown view */}
            <div className="w-full space-y-3">
              {exerciseTimeLeft > 0 ? (
                <>
                  <div className="text-4xl font-black text-brand-dark tabular-nums select-none">
                    {formatTime(exerciseTimeLeft)}
                  </div>
                  <button
                    onClick={closeExercise}
                    className="py-3 px-8 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-rose-500/10 cursor-pointer"
                  >
                    Hentikan Latihan
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="text-lg font-black text-brand-secondary flex items-center justify-center space-x-1.5">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Latihan Selesai!</span>
                  </div>
                  <p className="text-[10px] text-brand-secondary font-semibold">Bagus sekali! Anda telah merawat tubuh Anda hari ini.</p>
                  <button
                    onClick={closeExercise}
                    className="py-2.5 px-8 bg-brand-secondary hover:bg-brand-secondary/95 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Kembali
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WellnessCenter;
