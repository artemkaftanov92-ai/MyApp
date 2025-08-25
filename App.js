import React, { useState, useEffect } from "react";
import {
  Trophy,
  TrendingUp,
  Calendar,
  Shield,
  Plus,
  Settings,
  DollarSign,
  Target,
  Star,
  Zap,
  Trash2,
  User,
  Edit3,
  CheckSquare,
  Square,
  ListTodo,
  BarChart3,
  BookOpen,
  TrendingDown,
} from "lucide-react";

const ZeroToHeroApp = () => {
  // Функции для работы с localStorage
  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Ошибка сохранения данных:", error);
    }
  };

  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      return defaultValue;
    }
  };

  // Подключаем шрифт Exo из Google Fonts
  React.useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Exo:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const [userProfile, setUserProfile] = useState(
    loadFromLocalStorage("userProfile", {
      nickname: "EVOLUTION_TRADER",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=trader",
    })
  );

  const [tradingData, setTradingData] = useState(
    loadFromLocalStorage("tradingData", {
      totalProfit: 0,
      sessionProfit: 0,
      daysProfitable: 0,
      daysWithoutLoss: 0,
      totalTrades: 0,
      winRate: 0,
      deposit: 0,
      commission: 0,
      positiveTradesPercent: 0,
      avgPositiveTrade: 0,
      avgNegativeTrade: 0,
      bestDay: 0,
      worstDay: 0,
      activeDays: 0,
      avgDaily: 0,
      globalRanking: 0,
      rating: 0,
    })
  );

  const [customAvatar, setCustomAvatar] = useState(null);

  // Новое состояние для дневника сделок
  const [trades, setTrades] = useState(loadFromLocalStorage("trades", []));

  const [newTrade, setNewTrade] = useState({
    ticker: "",
    side: "Long",
    entryReasons: "",
    result: "",
    commission: "",
    comment: "",
    isSystematic: "Да",
  });

  const [showNewTradeForm, setShowNewTradeForm] = useState(false);

  // Состояние для депозитных операций
  const [depositOperation, setDepositOperation] = useState({
    type: "deposit", // 'deposit' или 'withdrawal'
    amount: "",
  });

  const [showDepositForm, setShowDepositForm] = useState(false);

  // Категории достижений
  const achievementCategories = {
    levelUp: { name: "Level Up", icon: "⚡️", description: "Повышение ранга" },
    tradeProfit: {
      name: "Профит за сделку",
      icon: "💵",
      description: "Результат за сделку",
    },
    dailyProfit: {
      name: "Профит за день",
      icon: "💰",
      description: "Результат за день",
    },
    discipline: {
      name: "Дисциплина",
      icon: "💎",
      description: "Соблюдение дисциплины",
    },
    stability: {
      name: "Стабильность",
      icon: "📈",
      description: "Серия профитных периодов",
    },
  };

  // Исходные достижения с категориями
  const [achievements, setAchievements] = useState(
    loadFromLocalStorage("achievements", [])
  );

  const [dailyTasks, setDailyTasks] = useState(
    loadFromLocalStorage("dailyTasks", [])
  );
  const [taskHistory, setTaskHistory] = useState(
    loadFromLocalStorage("taskHistory", {})
  ); // { "2024-08-24": [tasks] }
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showCalendar, setShowCalendar] = useState(false);

  const [newAchievement, setNewAchievement] = useState({
    category: "tradeProfit",
    value: 0,
    period: "days",
    event: "",
  });

  const [showNewAchievementForm, setShowNewAchievementForm] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState(userProfile);
  const [previousDeposit, setPreviousDeposit] = useState(0); // Для отслеживания изменений депозита

  const avatarOptions = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=trader",
  ];

  const ranks = [
    { name: "F", min: 0, max: 100, color: "#8B4513", level: 1 },
    { name: "E", min: 100, max: 500, color: "#A0522D", level: 2 },
    { name: "D", min: 500, max: 1000, color: "#CD853F", level: 3 },
    { name: "C", min: 1000, max: 5000, color: "#DAA520", level: 4 },
    { name: "B", min: 5000, max: 10000, color: "#FFD700", level: 5 },
    { name: "A", min: 10000, max: 50000, color: "#32CD32", level: 6 },
    { name: "S", min: 50000, max: 100000, color: "#1E90FF", level: 7 },
    { name: "S+", min: 100000, max: 1000000, color: "#9370DB", level: 8 },
    { name: "SSS", min: 1000000, max: 10000000, color: "#FF6B6B", level: 9 },
  ];

  // Автосохранение данных
  useEffect(() => {
    saveToLocalStorage("userProfile", userProfile);
  }, [userProfile]);

  useEffect(() => {
    saveToLocalStorage("tradingData", tradingData);
  }, [tradingData]);

  useEffect(() => {
    saveToLocalStorage("trades", trades);
  }, [trades]);

  useEffect(() => {
    saveToLocalStorage("achievements", achievements);
  }, [achievements]);

  useEffect(() => {
    saveToLocalStorage("dailyTasks", dailyTasks);
  }, [dailyTasks]);

  useEffect(() => {
    saveToLocalStorage("taskHistory", taskHistory);
  }, [taskHistory]);

  // Функция для форматирования даты в DD-MM-YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Функции для работы с депозитом
  const addDepositOperation = () => {
    if (!depositOperation.amount || parseFloat(depositOperation.amount) <= 0) {
      return;
    }

    const amount = parseFloat(depositOperation.amount);
    const isDeposit = depositOperation.type === "deposit";

    // Если это вывод и сумма больше текущего депозита, не даем совершить операцию
    if (!isDeposit && amount > tradingData.deposit) {
      alert("Недостаточно средств для вывода");
      return;
    }

    const operation = {
      id: trades.length + 1,
      type: "deposit_operation",
      operationType: depositOperation.type,
      amount: isDeposit ? amount : -amount,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      comment: isDeposit ? "Пополнение счета" : "Вывод средств",
    };

    setTrades((prev) => [operation, ...prev]);

    // Обновляем депозит
    setTradingData((prev) => ({
      ...prev,
      deposit: isDeposit ? prev.deposit + amount : prev.deposit - amount,
    }));

    setDepositOperation({ type: "deposit", amount: "" });
    setShowDepositForm(false);
  };

  // Функции для работы с дневником сделок
  const addNewTrade = () => {
    if (
      !newTrade.ticker ||
      !newTrade.entryReasons ||
      newTrade.result === "" ||
      newTrade.commission === ""
    ) {
      return;
    }

    const trade = {
      id: trades.length + 1,
      type: "trade",
      ...newTrade,
      result: parseFloat(newTrade.result),
      commission: parseFloat(newTrade.commission),
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setTrades((prev) => [trade, ...prev]);
    setNewTrade({
      ticker: "",
      side: "Long",
      entryReasons: "",
      result: "",
      commission: "",
      comment: "",
      isSystematic: "Да",
    });
    setShowNewTradeForm(false);

    // Обновляем баланс на основе результата сделки
    const netResult = trade.result - trade.commission;
    setTradingData((prev) => ({
      ...prev,
      deposit: prev.deposit + netResult,
      totalProfit: prev.totalProfit + netResult,
      totalTrades: prev.totalTrades + 1,
      commission: prev.commission + trade.commission,
    }));
  };

  const deleteTrade = (tradeId) => {
    const itemToDelete = trades.find((item) => item.id === tradeId);
    if (!itemToDelete) return;

    if (itemToDelete.type === "trade") {
      const netResult = itemToDelete.result - itemToDelete.commission;
      setTradingData((prev) => ({
        ...prev,
        deposit: prev.deposit - netResult,
        totalProfit: prev.totalProfit - netResult,
        totalTrades: Math.max(prev.totalTrades - 1, 0),
        commission: Math.max(prev.commission - itemToDelete.commission, 0),
      }));
    } else if (itemToDelete.type === "deposit_operation") {
      // Откатываем депозитную операцию
      setTradingData((prev) => ({
        ...prev,
        deposit: prev.deposit - itemToDelete.amount,
      }));
    }

    setTrades((prev) => prev.filter((item) => item.id !== tradeId));
  };

  const getTradeStats = () => {
    const actualTrades = trades.filter((item) => item.type === "trade");
    const totalTrades = actualTrades.length;
    const profitableTrades = actualTrades.filter((t) => t.result > 0).length;
    const totalProfit = actualTrades.reduce((sum, t) => sum + t.result, 0);
    const totalCommissions = actualTrades.reduce(
      (sum, t) => sum + t.commission,
      0
    );
    const netProfit = totalProfit - totalCommissions;
    const winRate =
      totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;
    const systematicTrades = actualTrades.filter(
      (t) => t.isSystematic === "Да"
    ).length;
    const systematicRate =
      totalTrades > 0 ? (systematicTrades / totalTrades) * 100 : 0;

    return {
      totalTrades,
      profitableTrades,
      totalProfit,
      totalCommissions,
      netProfit,
      winRate,
      systematicTrades,
      systematicRate,
    };
  };

  // Отслеживание изменения депозита и ранга для обновления достижений
  useEffect(() => {
    const currentRank = getCurrentRank(tradingData.deposit);
    const previousRank = getCurrentRank(previousDeposit);

    // Проверяем изменение ранга для достижений Level Up
    if (currentRank.level > previousRank.level) {
      setAchievements((prev) =>
        prev.map((achievement) => {
          if (achievement.category === "levelUp") {
            const targetRank = ranks.find((r) => r.name === achievement.value);
            if (
              targetRank &&
              currentRank.level >= targetRank.level &&
              !achievement.completed
            ) {
              return { ...achievement, completed: true, current: 1 };
            }
          }
          return achievement;
        })
      );
    }

    // Проверяем изменение депозита для достижений Профит за сделку
    const depositChange = tradingData.deposit - previousDeposit;
    if (depositChange > 0) {
      setAchievements((prev) =>
        prev.map((achievement) => {
          if (
            achievement.category === "tradeProfit" &&
            depositChange >= achievement.value &&
            !achievement.completed
          ) {
            return {
              ...achievement,
              completed: true,
              current: achievement.value,
            };
          }
          return achievement;
        })
      );
    }

    // Проверяем достижения по дням
    const today = new Date().toISOString().split("T")[0];
    const todayTrades = trades.filter(
      (t) => t.type === "trade" && t.date === today
    );
    const todayProfit = todayTrades.reduce(
      (sum, t) => sum + (t.result - t.commission),
      0
    );

    // Обновляем достижения "Профит за день"
    if (todayProfit > 0) {
      setAchievements((prev) =>
        prev.map((achievement) => {
          if (
            achievement.category === "dailyProfit" &&
            todayProfit >= achievement.value &&
            !achievement.completed
          ) {
            return {
              ...achievement,
              completed: true,
              current: achievement.value,
            };
          }
          return achievement;
        })
      );
    }

    // Проверяем серии профитных дней для достижений stability
    const checkProfitableStreak = () => {
      const tradesByDay = {};
      trades
        .filter((t) => t.type === "trade")
        .forEach((trade) => {
          if (!tradesByDay[trade.date]) tradesByDay[trade.date] = 0;
          tradesByDay[trade.date] += trade.result - trade.commission;
        });

      const sortedDays = Object.keys(tradesByDay).sort();
      let currentStreak = 0;
      let maxStreak = 0;

      sortedDays.forEach((day) => {
        if (tradesByDay[day] > 0) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });

      // Обновляем достижения stability
      setAchievements((prev) =>
        prev.map((achievement) => {
          if (
            achievement.category === "stability" &&
            achievement.period === "days"
          ) {
            const newCurrent = Math.min(maxStreak, achievement.value);
            if (newCurrent >= achievement.value && !achievement.completed) {
              return {
                ...achievement,
                completed: true,
                current: achievement.value,
              };
            }
            return { ...achievement, current: newCurrent };
          }
          return achievement;
        })
      );
    };

    checkProfitableStreak();

    setPreviousDeposit(tradingData.deposit);
  }, [tradingData.deposit, trades]);

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempProfile((prev) => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentRank = (deposit) => {
    return (
      ranks.find((rank) => deposit >= rank.min && deposit < rank.max) ||
      ranks[ranks.length - 1]
    );
  };

  const getNextRank = (deposit) => {
    const currentRankIndex = ranks.findIndex(
      (rank) => deposit >= rank.min && deposit < rank.max
    );
    return currentRankIndex < ranks.length - 1
      ? ranks[currentRankIndex + 1]
      : null;
  };

  const getRankProgress = (deposit) => {
    const currentRank = getCurrentRank(deposit);
    const progress =
      ((deposit - currentRank.min) / (currentRank.max - currentRank.min)) * 100;
    return Math.min(progress, 100);
  };

  // Новая функция для расчета прогресса текущего достижения
  const getAchievementProgress = (achievement) => {
    // Если достижение завершено, прогресс 100%
    if (achievement.completed) {
      return 100;
    }
    // Если есть текущее значение, рассчитываем прогресс
    if (achievement.current !== undefined && achievement.value !== undefined) {
      // Для числовых значений (tradeProfit, sessionProfit, stability)
      if (typeof achievement.value === "number") {
        return (achievement.current / achievement.value) * 100;
      }
      // Для текстовых значений (levelUp)
      if (achievement.category === "levelUp") {
        // Прогресс для Level Up зависит от текущего депозита по отношению к рангам
        const currentRank = getCurrentRank(tradingData.deposit);
        const targetRank = ranks.find((r) => r.name === achievement.value);
        if (targetRank && currentRank.level >= targetRank.level) {
          // Если текущий ранг равен или выше целевого, значит достижение выполнено
          return 100;
        } else if (nextRank) {
          // Если нет, показываем прогресс к следующему рангу
          return getRankProgress(tradingData.deposit);
        }
      }
    }
    // В остальных случаях прогресс 0%
    return 0;
  };

  const getWinRateColor = (winRate) => {
    if (winRate <= 50) {
      const ratio = winRate / 50;
      const red = 255;
      const green = Math.round(204 * ratio + 107 * (1 - ratio));
      const blue = Math.round(48 * ratio + 107 * (1 - ratio));
      return `rgb(${red}, ${green}, ${blue})`;
    } else {
      const ratio = (winRate - 50) / 50;
      const red = Math.round(204 * (1 - ratio));
      const green = Math.round(160 * (1 - ratio) + 255 * ratio);
      const blue = Math.round(48 * (1 - ratio) + 136 * ratio);
      return `rgb(${red}, ${green}, ${blue})`;
    }
  };

  const groupAchievementsByCategory = () => {
    const grouped = {};

    achievements.forEach((achievement) => {
      const category = achievement.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(achievement);
    });

    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => {
        if (category === "levelUp") {
          const aRank = ranks.find((r) => r.name === a.value);
          const bRank = ranks.find((r) => r.name === b.value);
          return (aRank?.level || 0) - (bRank?.level || 0);
        }
        return a.value - b.value;
      });
    });

    return grouped;
  };

  const getCurrentAchievementInCategory = (categoryAchievements) => {
    return (
      categoryAchievements.find((a) => !a.completed) ||
      categoryAchievements[categoryAchievements.length - 1]
    );
  };

  const getCategoryProgress = (categoryAchievements) => {
    const completed = categoryAchievements.filter((a) => a.completed).length;
    return (completed / categoryAchievements.length) * 100;
  };

  const getAchievementDescription = (achievement) => {
    const category = achievementCategories[achievement.category];

    switch (achievement.category) {
      case "levelUp":
        return `Достичь ранга ${achievement.value}`;
      case "tradeProfit":
        return `Заработать $${achievement.value} за одну сделку`;
      case "dailyProfit":
        return `Заработать $${achievement.value} за день`;
      case "discipline":
        const periodText = {
          days: "дней",
          weeks: "недель",
          months: "месяцев",
          years: "лет",
        };
        return achievement.event
          ? `${achievement.event} ${achievement.value} ${
              periodText[achievement.period]
            } подряд`
          : "Соблюдение дисциплины";
      case "stability":
        const stabilityPeriodText = {
          days: "дней",
          weeks: "недель",
          months: "месяцев",
          years: "лет",
        };
        return `${achievement.value} ${
          stabilityPeriodText[achievement.period]
        } подряд в профите`;
      default:
        return "Достижение";
    }
  };

  const deleteAchievement = (achievementId) => {
    setAchievements((prev) =>
      prev.filter((achievement) => achievement.id !== achievementId)
    );
  };

  const addNewAchievement = () => {
    if (
      newAchievement.category === "discipline" &&
      (!newAchievement.event || newAchievement.value <= 0)
    )
      return;
    if (
      (newAchievement.category === "tradeProfit" ||
        newAchievement.category === "dailyProfit" ||
        newAchievement.category === "stability") &&
      newAchievement.value <= 0
    )
      return;
    if (newAchievement.category === "levelUp" && !newAchievement.value) return;

    const achievement = {
      id: achievements.length + 1,
      category: newAchievement.category,
      value: newAchievement.value,
      current: 0,
      completed: false,
      ...(newAchievement.category === "stability" && {
        period: newAchievement.period,
      }),
      ...(newAchievement.category === "discipline" && {
        period: newAchievement.period,
        event: newAchievement.event,
      }),
    };

    setAchievements((prev) => [...prev, achievement]);
    setNewAchievement({
      category: "tradeProfit",
      value: 0,
      period: "days",
      event: "",
    });
    setShowNewAchievementForm(false);
  };

  const toggleTask = (taskId) => {
    const today = new Date().toISOString().split("T")[0];

    if (selectedDate === today) {
      setDailyTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    } else {
      setTaskHistory((prev) => ({
        ...prev,
        [selectedDate]: (prev[selectedDate] || []).map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      }));
    }
  };

  const addNewTask = () => {
    if (!newTask.trim()) return;

    const today = new Date().toISOString().split("T")[0];
    const task = {
      id: Date.now(), // уникальный ID
      name: newTask,
      target: 1,
      current: 0,
      completed: false,
      date: today,
    };

    if (selectedDate === today) {
      setDailyTasks((prev) => [...prev, task]);
    } else {
      // Добавляем в историю
      setTaskHistory((prev) => ({
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), task],
      }));
    }
    setNewTask("");
  };

  const deleteTask = (taskId) => {
    const today = new Date().toISOString().split("T")[0];

    if (selectedDate === today) {
      setDailyTasks((prev) => prev.filter((task) => task.id !== taskId));
    } else {
      setTaskHistory((prev) => ({
        ...prev,
        [selectedDate]: (prev[selectedDate] || []).filter(
          (task) => task.id !== taskId
        ),
      }));
    }
  };

  const saveProfile = () => {
    setUserProfile(tempProfile);
    setIsEditingProfile(false);
  };

  const cancelProfileEdit = () => {
    setTempProfile(userProfile);
    setIsEditingProfile(false);
  };

  const currentRank = getCurrentRank(tradingData.deposit);
  const nextRank = getNextRank(tradingData.deposit);
  const groupedAchievements = groupAchievementsByCategory();
  const tradeStats = getTradeStats();

  const styles = {
    body: {
      fontFamily:
        'Exo, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: "linear-gradient(135deg, #0a0a0a, #1a1a1a, #2d2d2d)",
      color: "#ffffff",
      minHeight: "100vh",
      overflowX: "hidden",
      margin: 0,
      padding: 0,
    },
    dashboard: {
      display: currentTab === "dashboard" ? "grid" : "block",
      gridTemplateColumns:
        currentTab === "dashboard" ? "320px 1fr 280px" : "1fr",
      gridTemplateRows: "auto 1fr",
      gap: "24px",
      padding: "24px",
      minHeight: "100vh",
    },
    header: {
      gridColumn: currentTab === "dashboard" ? "1 / -1" : "1",
      background:
        "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "20px",
      padding: "32px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
    },
    playerInfo: {
      display: "flex",
      alignItems: "center",
      gap: "24px",
      zIndex: 1,
    },
    avatarModern: {
      width: "80px",
      height: "80px",
      borderRadius: "20px",
      background: "linear-gradient(135deg, #40e0d0, #48d1cc)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "2.5em",
      position: "relative",
      overflow: "hidden",
      border: "3px solid rgba(128, 128, 128, 0.4)",
      backgroundImage:
        "linear-gradient(135deg, #40e0d0, #48d1cc), linear-gradient(45deg, rgba(128, 128, 128, 0.4), rgba(128, 128, 128, 0.4))",
      backgroundOrigin: "border-box",
      backgroundClip: "content-box, border-box",
    },
    playerName: {
      fontSize: "2.2em",
      fontWeight: "700",
      marginBottom: "8px",
      background: "linear-gradient(135deg, #40e0d0, #ffffff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    balanceDisplay: {
      textAlign: "right",
      zIndex: 1,
    },
    balanceAmount: {
      fontSize: "3.2em",
      fontWeight: "300",
      background: "linear-gradient(135deg, #40e0d0, #ffffff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      marginBottom: "4px",
    },
    balanceLabel: {
      opacity: 0.7,
      fontSize: "1em",
    },
    sidebar: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    card: {
      background:
        "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "16px",
      padding: "24px",
      position: "relative",
      transition: "all 0.3s ease",
    },
    cardTitle: {
      fontSize: "1.1em",
      fontWeight: "600",
      marginBottom: "20px",
      color: "#40e0d0",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    rankDisplay: {
      textAlign: "center",
      marginBottom: "20px",
    },
    rankName: {
      fontSize: "3em",
      fontWeight: "700",
      background: `linear-gradient(135deg, ${currentRank.color}, #ffffff)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      lineHeight: 1,
      transition: "all 0.3s ease",
    },
    rankLabel: {
      fontSize: "1em",
      opacity: 0.8,
      marginTop: "4px",
    },
    progressContainer: {
      margin: "16px 0",
    },
    progressTrack: {
      width: "100%",
      height: "8px",
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "20px",
      overflow: "hidden",
      position: "relative",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg, #40e0d0, #48d1cc)",
      borderRadius: "20px",
      transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
    },
    progressText: {
      fontSize: "0.9em",
      opacity: 0.7,
      textAlign: "center",
      marginTop: "8px",
    },
    navigation: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "24px",
      gap: "8px",
    },
    navButton: {
      padding: "12px 24px",
      borderRadius: "12px",
      border: "none",
      background: "rgba(255, 255, 255, 0.1)",
      color: "#ffffff",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontWeight: "600",
    },
    activeNavButton: {
      background: "linear-gradient(135deg, #40e0d0, #48d1cc)",
      color: "#000000",
    },
    metricsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginTop: "24px",
    },
    metricCard: {
      background:
        "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "16px",
      padding: "24px",
      textAlign: "center",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    metricValue: {
      fontSize: "2.4em",
      fontWeight: "400",
      marginBottom: "8px",
      color: "#40e0d0",
    },
    metricLabel: {
      fontSize: "0.9em",
      opacity: 0.7,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    positive: {
      color: "#00ff88",
    },
    negative: {
      color: "#ff6b6b",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.dashboard}>
        {/* Header */}
        <header
          style={styles.header}
          onClick={() => setCurrentTab("dashboard")}
        >
          <div style={styles.playerInfo}>
            <div style={styles.avatarModern}>
              <img
                src={userProfile.avatar}
                alt="Avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "17px",
                  objectFit: "cover",
                }}
              />
            </div>
            <div>
              <h1 style={styles.playerName}>{userProfile.nickname}</h1>
            </div>
          </div>
          <div style={styles.balanceDisplay}>
            <div style={styles.balanceAmount}>
              ${tradingData.deposit.toFixed(2)}
            </div>
          </div>
        </header>

        {currentTab === "dashboard" && (
          <>
            {/* Left Sidebar */}
            <aside style={styles.sidebar}>
              {/* Player Rank Card */}
              <div style={styles.card}>
                <div style={styles.cardTitle}>⭐ Мой профиль</div>
                {/* Кнопка перехода в настройки */}
                <button
                  onClick={() => setCurrentTab("settings")}
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "none",
                    border: "none",
                    color: "rgba(128, 128, 128, 0.7)",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  <Settings size={20} />
                </button>
                <div style={styles.rankDisplay}>
                  <div
                    key={`${currentRank.name}-${tradingData.deposit}`}
                    style={styles.rankName}
                  >
                    {currentRank.name}
                  </div>
                  <div style={styles.rankLabel}>Ранг</div>
                </div>
                <div style={styles.progressContainer}>
                  <div style={styles.progressTrack}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${getRankProgress(tradingData.deposit)}%`,
                      }}
                    ></div>
                  </div>
                  <div style={styles.progressText}>
                    ${tradingData.deposit.toFixed(2)} / $
                    {nextRank ? nextRank.min.toLocaleString() : "МАКС"}
                  </div>
                </div>
              </div>

              {/* Achievements Card */}
              <div style={{ ...styles.card, position: "relative" }}>
                <div style={styles.cardTitle}>🏆 Достижения</div>
                <button
                  onClick={() => setCurrentTab("achievements")}
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "none",
                    border: "none",
                    color: "rgba(128, 128, 128, 0.7)",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  <Settings size={20} />
                </button>
                {achievements.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "rgba(255, 255, 255, 0.5)",
                      padding: "20px",
                    }}
                  >
                    Пока нет достижений
                  </p>
                ) : (
                  Object.entries(groupedAchievements).map(
                    ([categoryKey, categoryAchievements]) => {
                      const category = achievementCategories[categoryKey];
                      const currentAchievement =
                        getCurrentAchievementInCategory(categoryAchievements);
                      const achievementProgress =
                        getAchievementProgress(currentAchievement);
                      const completedCount = categoryAchievements.filter(
                        (a) => a.completed
                      ).length;

                      return (
                        <div
                          key={categoryKey}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            padding: "16px 0",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "12px",
                              background: currentAchievement.completed
                                ? "linear-gradient(135deg, #00ff88, #00cc70)"
                                : "linear-gradient(135deg, #6a5acd, #9370db)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.5em",
                            }}
                          >
                            {category.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4
                              style={{
                                fontWeight: "600",
                                marginBottom: "4px",
                                color: currentAchievement.completed
                                  ? "#00ff88"
                                  : "#ffffff",
                              }}
                            >
                              {category.name}
                            </h4>
                            <small style={{ opacity: 0.7, fontSize: "0.85em" }}>
                              {getAchievementDescription(currentAchievement)}
                            </small>
                            <div style={{ marginTop: "8px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  fontSize: "0.8em",
                                  marginBottom: "4px",
                                }}
                              >
                                <span>
                                  {completedCount} /{" "}
                                  {categoryAchievements.length}
                                </span>
                                <span>{Math.round(achievementProgress)}%</span>
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  height: "4px",
                                  background: "rgba(255, 255, 255, 0.1)",
                                  borderRadius: "2px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    height: "100%",
                                    width: `${achievementProgress}%`,
                                    background: currentAchievement.completed
                                      ? "linear-gradient(90deg, #00ff88, #00cc70)"
                                      : "linear-gradient(90deg, #40e0d0, #48d1cc)",
                                    borderRadius: "2px",
                                    transition: "width 0.3s ease",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>
            </aside>

            {/* Main Area */}
            <main
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {/* Chart Container */}
              <div
                style={{
                  height: "360px",
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "20px",
                  display: "flex",
                  flexDirection: "column",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ fontSize: "1.5em", color: "#40e0d0" }}>
                    📊 Эквити
                  </div>
                  <button
                    onClick={() => setCurrentTab("journal")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(128, 128, 128, 0.7)",
                      cursor: "pointer",
                      fontSize: "18px",
                    }}
                  >
                    <Settings size={20} />
                  </button>
                </div>

                {/* Equity Chart */}
                <div
                  style={{ flex: 1, position: "relative", minHeight: "250px" }}
                >
                  {(() => {
                    // Подготавливаем данные для графика
                    const actualTrades = trades
                      .filter((t) => t.type === "trade")
                      .reverse(); // reverse для хронологического порядка

                    if (actualTrades.length === 0) {
                      return (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            color: "rgba(255, 255, 255, 0.5)",
                            fontSize: "1.1em",
                          }}
                        >
                          Нет данных для отображения графика
                        </div>
                      );
                    }

                    // Создаем массив точек эквити
                    let runningEquity = 0;
                    const equityPoints = [{ x: 0, y: 0, date: "Начало" }]; // начальная точка

                    actualTrades.forEach((trade, index) => {
                      runningEquity += trade.result - trade.commission;
                      equityPoints.push({
                        x: index + 1,
                        y: runningEquity,
                        date: trade.date,
                        time: trade.time,
                      });
                    });

                    // Находим минимальное и максимальное значения для масштабирования
                    const minY = Math.min(...equityPoints.map((p) => p.y));
                    const maxY = Math.max(...equityPoints.map((p) => p.y));
                    const maxX = equityPoints.length - 1;

                    // Добавляем отступы для лучшего отображения
                    const yPadding = Math.max(Math.abs(maxY - minY) * 0.1, 10);
                    const chartMinY = minY - yPadding;
                    const chartMaxY = maxY + yPadding;

                    const chartHeight = 250;
                    const chartWidth = 1200; // Фиксированная ширина на весь блок
                    const marginLeft = 60; // Отступ слева для меток по оси Y
                    const marginBottom = 40; // Отступ снизу для меток по оси X
                    const marginTop = 20; // Отступ сверху
                    const marginRight = 20; // Отступ справа

                    // Рабочая область графика (без отступов)
                    const plotWidth = chartWidth - marginLeft - marginRight;
                    const plotHeight = chartHeight - marginTop - marginBottom;

                    // Функция для преобразования координат
                    const getChartY = (value) => {
                      if (chartMaxY === chartMinY)
                        return marginTop + plotHeight / 2;
                      return (
                        marginTop +
                        plotHeight -
                        ((value - chartMinY) / (chartMaxY - chartMinY)) *
                          plotHeight
                      );
                    };

                    const getChartX = (index) => {
                      if (maxX === 0) return marginLeft;
                      return marginLeft + (index / maxX) * plotWidth;
                    };

                    // Создаем путь для линии
                    let pathData = `M ${getChartX(0)} ${getChartY(
                      equityPoints[0].y
                    )}`;
                    for (let i = 1; i < equityPoints.length; i++) {
                      pathData += ` L ${getChartX(i)} ${getChartY(
                        equityPoints[i].y
                      )}`;
                    }

                    // Создаем путь для заливки области
                    let areaPath =
                      pathData +
                      ` L ${getChartX(maxX)} ${
                        marginTop + plotHeight
                      } L ${marginLeft} ${marginTop + plotHeight} Z`;

                    return (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          overflowX: "hidden",
                          overflowY: "hidden",
                        }}
                      >
                        <svg
                          width="100%"
                          height={chartHeight}
                          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                          style={{ display: "block" }}
                        >
                          {/* Фон графика */}
                          <rect
                            x={marginLeft}
                            y={marginTop}
                            width={plotWidth}
                            height={plotHeight}
                            fill="rgba(255,255,255,0.02)"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                          />

                          {/* Оси координат */}
                          {/* Ось Y (слева) */}
                          <line
                            x1={marginLeft}
                            y1={marginTop}
                            x2={marginLeft}
                            y2={marginTop + plotHeight}
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="2"
                          />
                          {/* Ось X (снизу) */}
                          <line
                            x1={marginLeft}
                            y1={marginTop + plotHeight}
                            x2={marginLeft + plotWidth}
                            y2={marginTop + plotHeight}
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="2"
                          />

                          {/* Метки по оси Y (доллары) */}
                          {(() => {
                            const yTicks = [];
                            const range = chartMaxY - chartMinY;
                            // Определяем оптимальный шаг в зависимости от диапазона
                            let step;
                            if (range <= 500) step = 50;
                            else if (range <= 1000) step = 100;
                            else if (range <= 5000) step = 500;
                            else if (range <= 10000) step = 1000;
                            else if (range <= 50000) step = 5000;
                            else step = 10000;

                            const minRounded =
                              Math.floor(chartMinY / step) * step;
                            const maxRounded =
                              Math.ceil(chartMaxY / step) * step;

                            for (
                              let value = minRounded;
                              value <= maxRounded;
                              value += step
                            ) {
                              if (value >= chartMinY && value <= chartMaxY) {
                                const y = getChartY(value);
                                yTicks.push(
                                  <g key={`y-tick-${value}`}>
                                    <line
                                      x1={marginLeft - 5}
                                      y1={y}
                                      x2={marginLeft}
                                      y2={y}
                                      stroke="rgba(255,255,255,0.5)"
                                      strokeWidth="1"
                                    />
                                    <text
                                      x={marginLeft - 10}
                                      y={y + 4}
                                      fill="rgba(255,255,255,0.8)"
                                      fontSize="11"
                                      textAnchor="end"
                                    >
                                      ${value.toFixed(0)}
                                    </text>
                                  </g>
                                );
                              }
                            }
                            return yTicks;
                          })()}

                          {/* Метки по оси X (даты) */}
                          {(() => {
                            const xTicks = [];
                            const tickCount = Math.min(
                              equityPoints.length - 1,
                              5
                            );
                            if (tickCount > 0) {
                              for (let i = 0; i <= tickCount; i++) {
                                const pointIndex = Math.round(
                                  (equityPoints.length - 1) * (i / tickCount)
                                );
                                const point = equityPoints[pointIndex];
                                const x = getChartX(pointIndex);
                                xTicks.push(
                                  <g key={`x-tick-${i}`}>
                                    <line
                                      x1={x}
                                      y1={marginTop + plotHeight}
                                      x2={x}
                                      y2={marginTop + plotHeight + 5}
                                      stroke="rgba(255,255,255,0.5)"
                                      strokeWidth="1"
                                    />
                                    <text
                                      x={x}
                                      y={marginTop + plotHeight + 18}
                                      fill="rgba(255,255,255,0.8)"
                                      fontSize="10"
                                      textAnchor="middle"
                                    >
                                      {point.date === "Начало"
                                        ? "Старт"
                                        : point.date
                                            .split("-")
                                            .reverse()
                                            .join(".")}
                                    </text>
                                  </g>
                                );
                              }
                            }
                            return xTicks;
                          })()}

                          {/* Нулевая линия */}
                          <line
                            x1={marginLeft}
                            y1={getChartY(0)}
                            x2={marginLeft + plotWidth}
                            y2={getChartY(0)}
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth="1"
                            strokeDasharray="3,3"
                          />

                          {/* Градиент для заливки */}
                          <defs>
                            <linearGradient
                              id="equityGradient"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                stopColor="#40e0d0"
                                stopOpacity="0.3"
                              />
                              <stop
                                offset="100%"
                                stopColor="#40e0d0"
                                stopOpacity="0.05"
                              />
                            </linearGradient>
                          </defs>

                          {/* Заливка области под графиком */}
                          <path d={areaPath} fill="url(#equityGradient)" />

                          {/* Основная линия графика */}
                          <path
                            d={pathData}
                            fill="none"
                            stroke="#40e0d0"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Точки на графике */}
                          {equityPoints.map((point, index) => (
                            <g key={index}>
                              <circle
                                cx={getChartX(index)}
                                cy={getChartY(point.y)}
                                r="4"
                                fill="#40e0d0"
                                stroke="#ffffff"
                                strokeWidth="2"
                              />
                              {/* Tooltip при наведении */}
                              <circle
                                cx={getChartX(index)}
                                cy={getChartY(point.y)}
                                r="8"
                                fill="transparent"
                                style={{ cursor: "pointer" }}
                              >
                                <title>
                                  {point.date === "Начало"
                                    ? `Начало: $0.00`
                                    : `${point.date} ${
                                        point.time
                                      }: $${point.y.toFixed(2)}`}
                                </title>
                              </circle>
                            </g>
                          ))}
                        </svg>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Metrics Grid */}
              <div style={styles.metricsGrid}>
                <div style={styles.metricCard}>
                  <div
                    style={{
                      ...styles.metricValue,
                      ...(tradeStats.netProfit >= 0
                        ? styles.positive
                        : styles.negative),
                    }}
                  >
                    {tradeStats.netProfit >= 0 ? "+" : ""}$
                    {tradeStats.netProfit.toFixed(0)}
                  </div>
                  <div style={styles.metricLabel}>Финрез</div>
                </div>
                <div style={styles.metricCard}>
                  <div style={{ ...styles.metricValue, ...styles.negative }}>
                    ${tradeStats.totalCommissions.toFixed(1)}
                  </div>
                  <div style={styles.metricLabel}>Комиссия</div>
                </div>
                <div style={styles.metricCard}>
                  <div
                    style={{
                      ...styles.metricValue,
                      color: getWinRateColor(tradeStats.winRate),
                    }}
                  >
                    {tradeStats.winRate.toFixed(0)}%
                  </div>
                  <div style={styles.metricLabel}>Винрейт</div>
                </div>
                <div style={styles.metricCard}>
                  <div style={{ ...styles.metricValue, ...styles.positive }}>
                    +$
                    {(() => {
                      const actualTrades = trades.filter(
                        (t) => t.type === "trade"
                      );
                      const profitableTrades = actualTrades.filter(
                        (t) => t.result - t.commission > 0
                      );
                      if (profitableTrades.length === 0) return "0";
                      const totalProfit = profitableTrades.reduce(
                        (sum, t) => sum + (t.result - t.commission),
                        0
                      );
                      return (totalProfit / profitableTrades.length).toFixed(1);
                    })()}
                  </div>
                  <div style={styles.metricLabel}>Средняя прибыль</div>
                </div>
                <div style={styles.metricCard}>
                  <div style={{ ...styles.metricValue, ...styles.negative }}>
                    -$
                    {(() => {
                      const actualTrades = trades.filter(
                        (t) => t.type === "trade"
                      );
                      const losingTrades = actualTrades.filter(
                        (t) => t.result - t.commission < 0
                      );
                      if (losingTrades.length === 0) return "0";
                      const totalLoss = losingTrades.reduce(
                        (sum, t) => sum + Math.abs(t.result - t.commission),
                        0
                      );
                      return (totalLoss / losingTrades.length).toFixed(1);
                    })()}
                  </div>
                  <div style={styles.metricLabel}>Средний убыток</div>
                </div>
              </div>
            </main>

            {/* Right Sidebar */}
            <aside style={styles.sidebar}>
              {/* Records Card */}
              <div style={styles.card}>
                <div style={styles.cardTitle}>🏆 Рекорды</div>
                <div style={{ margin: "16px 0" }}>
                  {[
                    {
                      label: "Лучшая сделка:",
                      value: `${(() => {
                        const actualTrades = trades.filter(
                          (t) => t.type === "trade"
                        );
                        if (actualTrades.length === 0) return "0";
                        const bestTrade = Math.max(
                          ...actualTrades.map((t) => t.result - t.commission)
                        );
                        return bestTrade >= 0
                          ? `+${bestTrade.toFixed(0)}`
                          : `${bestTrade.toFixed(0)}`;
                      })()}`,
                      positive: (() => {
                        const actualTrades = trades.filter(
                          (t) => t.type === "trade"
                        );
                        if (actualTrades.length === 0) return null;
                        const bestTrade = Math.max(
                          ...actualTrades.map((t) => t.result - t.commission)
                        );
                        return bestTrade >= 0;
                      })(),
                    },
                    {
                      label: "Лучший день:",
                      value: `${(() => {
                        const tradesByDay = {};
                        trades
                          .filter((t) => t.type === "trade")
                          .forEach((trade) => {
                            if (!tradesByDay[trade.date])
                              tradesByDay[trade.date] = 0;
                            tradesByDay[trade.date] +=
                              trade.result - trade.commission;
                          });
                        const dailyResults = Object.values(tradesByDay);
                        if (dailyResults.length === 0) return "0";
                        const bestDay = Math.max(...dailyResults);
                        return bestDay >= 0
                          ? `+${bestDay.toFixed(0)}`
                          : `${bestDay.toFixed(0)}`;
                      })()}`,
                      positive: (() => {
                        const tradesByDay = {};
                        trades
                          .filter((t) => t.type === "trade")
                          .forEach((trade) => {
                            if (!tradesByDay[trade.date])
                              tradesByDay[trade.date] = 0;
                            tradesByDay[trade.date] +=
                              trade.result - trade.commission;
                          });
                        const dailyResults = Object.values(tradesByDay);
                        if (dailyResults.length === 0) return null;
                        const bestDay = Math.max(...dailyResults);
                        return bestDay >= 0;
                      })(),
                    },
                    {
                      label: "Лучшая неделя:",
                      value: `${(() => {
                        const tradesByWeek = {};
                        trades
                          .filter((t) => t.type === "trade")
                          .forEach((trade) => {
                            const date = new Date(trade.date);
                            const weekStart = new Date(
                              date.setDate(date.getDate() - date.getDay())
                            );
                            const weekKey = weekStart
                              .toISOString()
                              .split("T")[0];
                            if (!tradesByWeek[weekKey])
                              tradesByWeek[weekKey] = 0;
                            tradesByWeek[weekKey] +=
                              trade.result - trade.commission;
                          });
                        const weeklyResults = Object.values(tradesByWeek);
                        if (weeklyResults.length === 0) return "0";
                        const bestWeek = Math.max(...weeklyResults);
                        return bestWeek >= 0
                          ? `+${bestWeek.toFixed(0)}`
                          : `${bestWeek.toFixed(0)}`;
                      })()}`,
                      positive: (() => {
                        const tradesByWeek = {};
                        trades
                          .filter((t) => t.type === "trade")
                          .forEach((trade) => {
                            const date = new Date(trade.date);
                            const weekStart = new Date(
                              date.setDate(date.getDate() - date.getDay())
                            );
                            const weekKey = weekStart
                              .toISOString()
                              .split("T")[0];
                            if (!tradesByWeek[weekKey])
                              tradesByWeek[weekKey] = 0;
                            tradesByWeek[weekKey] +=
                              trade.result - trade.commission;
                          });
                        const weeklyResults = Object.values(tradesByWeek);
                        if (weeklyResults.length === 0) return null;
                        const bestWeek = Math.max(...weeklyResults);
                        return bestWeek >= 0;
                      })(),
                    },
                    {
                      label: "Лучший месяц:",
                      value: `${(() => {
                        const tradesByMonth = {};
                        trades
                          .filter((t) => t.type === "trade")
                          .forEach((trade) => {
                            const monthKey = trade.date.substring(0, 7); // YYYY-MM
                            if (!tradesByMonth[monthKey])
                              tradesByMonth[monthKey] = 0;
                            tradesByMonth[monthKey] +=
                              trade.result - trade.commission;
                          });
                        const monthlyResults = Object.values(tradesByMonth);
                        if (monthlyResults.length === 0) return "0";
                        const bestMonth = Math.max(...monthlyResults);
                        return bestMonth >= 0
                          ? `+${bestMonth.toFixed(0)}`
                          : `${bestMonth.toFixed(0)}`;
                      })()}`,
                      positive: (() => {
                        const tradesByMonth = {};
                        trades
                          .filter((t) => t.type === "trade")
                          .forEach((trade) => {
                            const monthKey = trade.date.substring(0, 7); // YYYY-MM
                            if (!tradesByMonth[monthKey])
                              tradesByMonth[monthKey] = 0;
                            tradesByMonth[monthKey] +=
                              trade.result - trade.commission;
                          });
                        const monthlyResults = Object.values(tradesByMonth);
                        if (monthlyResults.length === 0) return null;
                        const bestMonth = Math.max(...monthlyResults);
                        return bestMonth >= 0;
                      })(),
                    },
                    {
                      label: "Лучший год:",
                      value: `${(() => {
                        const tradesByYear = {};
                        trades
                          .filter((t) => t.type === "trade")
                          .forEach((trade) => {
                            const yearKey = trade.date.substring(0, 4); // YYYY
                            if (!tradesByYear[yearKey])
                              tradesByYear[yearKey] = 0;
                            tradesByYear[yearKey] +=
                              trade.result - trade.commission;
                          });
                        const yearlyResults = Object.values(tradesByYear);
                        if (yearlyResults.length === 0) return "0";
                        const bestYear = Math.max(...yearlyResults);
                        return bestYear >= 0
                          ? `+${bestYear.toFixed(0)}`
                          : `${bestYear.toFixed(0)}`;
                      })()}`,
                      positive: (() => {
                        const tradesByYear = {};
                        trades
                          .filter((t) => t.type === "trade")
                          .forEach((trade) => {
                            const yearKey = trade.date.substring(0, 4); // YYYY
                            if (!tradesByYear[yearKey])
                              tradesByYear[yearKey] = 0;
                            tradesByYear[yearKey] +=
                              trade.result - trade.commission;
                          });
                        const yearlyResults = Object.values(tradesByYear);
                        if (yearlyResults.length === 0) return null;
                        const bestYear = Math.max(...yearlyResults);
                        return bestYear >= 0;
                      })(),
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "12px 0",
                        padding: "8px 0",
                        borderBottom:
                          index < 4
                            ? "1px solid rgba(255, 255, 255, 0.1)"
                            : "none",
                      }}
                    >
                      <span>{item.label}</span>
                      <span
                        style={{
                          color:
                            item.positive === true
                              ? "#00ff88"
                              : item.positive === false
                              ? "#ff6b6b"
                              : "#40e0d0",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Quests Card */}
              <div style={{ ...styles.card, position: "relative" }}>
                <div style={styles.cardTitle}>📋 Ежедневные квесты</div>
                <button
                  onClick={() => setCurrentTab("tasks")}
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "none",
                    border: "none",
                    color: "rgba(128, 128, 128, 0.7)",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  <Settings size={20} />
                </button>
                {dailyTasks.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "rgba(255, 255, 255, 0.5)",
                      padding: "20px",
                    }}
                  >
                    Пока нет задач
                  </p>
                ) : (
                  dailyTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(106, 90, 205, 0.1), rgba(147, 112, 219, 0.05))",
                        border: "1px solid rgba(106, 90, 205, 0.2)",
                        borderRadius: "12px",
                        padding: "20px",
                        margin: "12px 0",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <div style={{ fontWeight: "600", fontSize: "1em" }}>
                          {task.name}
                        </div>
                        <button
                          onClick={() => toggleTask(task.id)}
                          style={{
                            background: task.completed
                              ? "#00ff88"
                              : "rgba(255, 255, 255, 0.1)",
                            border: "none",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            color: task.completed ? "#000" : "#fff",
                            cursor: "pointer",
                            fontSize: "0.8em",
                            fontWeight: "600",
                          }}
                        >
                          {task.completed ? "✓" : "Отметить"}
                        </button>
                      </div>
                      <div
                        style={{
                          fontSize: "0.9em",
                          opacity: 0.8,
                          color: task.completed ? "#00ff88" : "#ffffff",
                        }}
                      >
                        {task.completed
                          ? "Выполнено ✓"
                          : `Прогресс: ${task.current} / ${task.target}`}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </aside>
          </>
        )}

        {/* Trading Journal Tab */}
        {currentTab === "journal" && (
          <div style={{ gridColumn: "1 / -1", padding: "0 20px" }}>
            {/* Add Trade and Deposit Buttons */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "32px",
                display: "flex",
                gap: "16px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setShowNewTradeForm(!showNewTradeForm)}
                style={{
                  background: "linear-gradient(135deg, #40e0d0, #48d1cc)",
                  color: "#000000",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  fontSize: "1em",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Plus size={20} />
                Добавить сделку
              </button>

              <button
                onClick={() => setShowDepositForm(!showDepositForm)}
                style={{
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  color: "#000000",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  fontSize: "1em",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <DollarSign size={20} />
                Депозит
              </button>
            </div>

            {/* Deposit Form */}
            {showDepositForm && (
              <div
                style={{
                  ...styles.card,
                  marginBottom: "32px",
                  maxWidth: "600px",
                  margin: "0 auto 32px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.3em",
                    fontWeight: "700",
                    marginBottom: "24px",
                    color: "#FFD700",
                  }}
                >
                  <DollarSign
                    size={20}
                    style={{ marginRight: "8px", display: "inline" }}
                  />
                  Операции с депозитом
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      Тип операции
                    </label>
                    <select
                      value={depositOperation.type}
                      onChange={(e) =>
                        setDepositOperation((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        padding: "12px",
                        color: "#ffffff",
                        fontSize: "1em",
                      }}
                    >
                      <option
                        value="deposit"
                        style={{ background: "#1a1a1a", color: "#ffffff" }}
                      >
                        Пополнение
                      </option>
                      <option
                        value="withdrawal"
                        style={{ background: "#1a1a1a", color: "#ffffff" }}
                      >
                        Вывод
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      Сумма ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={depositOperation.amount}
                      onChange={(e) =>
                        setDepositOperation((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        padding: "12px",
                        color: "#ffffff",
                        fontSize: "1em",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={addDepositOperation}
                    style={{
                      flex: 1,
                      background: "linear-gradient(135deg, #FFD700, #FFA500)",
                      color: "#000000",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontSize: "1em",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {depositOperation.type === "deposit"
                      ? "Пополнить"
                      : "Вывести"}
                  </button>
                  <button
                    onClick={() => setShowDepositForm(false)}
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontSize: "1em",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {/* Add Trade Form */}
            {showNewTradeForm && (
              <div
                style={{
                  ...styles.card,
                  marginBottom: "32px",
                  maxWidth: "800px",
                  margin: "0 auto 32px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.3em",
                    fontWeight: "700",
                    marginBottom: "24px",
                    color: "#40e0d0",
                  }}
                >
                  <BookOpen
                    size={20}
                    style={{ marginRight: "8px", display: "inline" }}
                  />
                  Новая сделка
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      Тикер
                    </label>
                    <input
                      type="text"
                      placeholder="AAPL, TSLA, BTC..."
                      value={newTrade.ticker}
                      onChange={(e) =>
                        setNewTrade((prev) => ({
                          ...prev,
                          ticker: e.target.value.toUpperCase(),
                        }))
                      }
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        padding: "12px",
                        color: "#ffffff",
                        fontSize: "1em",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      Сторона
                    </label>
                    <select
                      value={newTrade.side}
                      onChange={(e) =>
                        setNewTrade((prev) => ({
                          ...prev,
                          side: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        padding: "12px",
                        color: "#ffffff",
                        fontSize: "1em",
                      }}
                    >
                      <option
                        value="Long"
                        style={{ background: "#1a1a1a", color: "#ffffff" }}
                      >
                        Long
                      </option>
                      <option
                        value="Short"
                        style={{ background: "#1a1a1a", color: "#ffffff" }}
                      >
                        Short
                      </option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    Причины входа
                  </label>
                  <textarea
                    placeholder="Опишите основания для совершения сделки..."
                    value={newTrade.entryReasons}
                    onChange={(e) =>
                      setNewTrade((prev) => ({
                        ...prev,
                        entryReasons: e.target.value,
                      }))
                    }
                    rows={3}
                    style={{
                      width: "100%",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      padding: "12px",
                      color: "#ffffff",
                      fontSize: "1em",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      Результат ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newTrade.result}
                      onChange={(e) =>
                        setNewTrade((prev) => ({
                          ...prev,
                          result: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        padding: "12px",
                        color: "#ffffff",
                        fontSize: "1em",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      Комиссия ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newTrade.commission}
                      onChange={(e) =>
                        setNewTrade((prev) => ({
                          ...prev,
                          commission: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        padding: "12px",
                        color: "#ffffff",
                        fontSize: "1em",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      Система
                    </label>
                    <select
                      value={newTrade.isSystematic}
                      onChange={(e) =>
                        setNewTrade((prev) => ({
                          ...prev,
                          isSystematic: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        padding: "12px",
                        color: "#ffffff",
                        fontSize: "1em",
                      }}
                    >
                      <option
                        value="Да"
                        style={{ background: "#1a1a1a", color: "#ffffff" }}
                      >
                        Да
                      </option>
                      <option
                        value="Нет"
                        style={{ background: "#1a1a1a", color: "#ffffff" }}
                      >
                        Нет
                      </option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    Комментарий
                  </label>
                  <textarea
                    placeholder="Дополнительные заметки к сделке..."
                    value={newTrade.comment}
                    onChange={(e) =>
                      setNewTrade((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    rows={2}
                    style={{
                      width: "100%",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      padding: "12px",
                      color: "#ffffff",
                      fontSize: "1em",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={addNewTrade}
                    style={{
                      flex: 1,
                      background: "linear-gradient(135deg, #40e0d0, #48d1cc)",
                      color: "#000000",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontSize: "1em",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Добавить сделку
                  </button>
                  <button
                    onClick={() => setShowNewTradeForm(false)}
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontSize: "1em",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {/* Trade Statistics - только "Всего сделок" и "Системность" */}
            <div
              style={{
                ...styles.card,
                marginBottom: "32px",
                maxWidth: "1000px",
                margin: "0 auto 32px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.3em",
                  fontWeight: "700",
                  marginBottom: "24px",
                  color: "#40e0d0",
                }}
              >
                <BarChart3
                  size={20}
                  style={{ marginRight: "8px", display: "inline" }}
                />
                Статистика дневника
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "40px",
                  justifyContent: "center",
                  maxWidth: "400px",
                  margin: "0 auto",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2.4em",
                      fontWeight: "700",
                      color: "#40e0d0",
                      marginBottom: "8px",
                    }}
                  >
                    {tradeStats.totalTrades}
                  </div>
                  <div
                    style={{
                      fontSize: "0.9em",
                      opacity: 0.7,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Всего сделок
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2.4em",
                      fontWeight: "700",
                      color: "#FFD700",
                      marginBottom: "8px",
                    }}
                  >
                    {tradeStats.systematicRate.toFixed(1)}%
                  </div>
                  <div
                    style={{
                      fontSize: "0.9em",
                      opacity: 0.7,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Системность
                  </div>
                </div>
              </div>
            </div>

            {/* Trades List */}
            <div
              style={{ ...styles.card, maxWidth: "1400px", margin: "0 auto" }}
            >
              <h3
                style={{
                  fontSize: "1.3em",
                  fontWeight: "700",
                  marginBottom: "24px",
                  color: "#40e0d0",
                }}
              >
                История сделок
              </h3>

              {trades.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "rgba(255, 255, 255, 0.5)",
                    padding: "32px",
                  }}
                >
                  Пока нет записей о сделках
                </p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr
                        style={{
                          borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <th
                          style={{
                            padding: "12px 8px",
                            textAlign: "left",
                            color: "#40e0d0",
                            fontWeight: "600",
                            fontSize: "0.9em",
                          }}
                        >
                          Дата/Время
                        </th>
                        <th
                          style={{
                            padding: "12px 8px",
                            textAlign: "left",
                            color: "#40e0d0",
                            fontWeight: "600",
                            fontSize: "0.9em",
                          }}
                        >
                          Тип
                        </th>
                        <th
                          style={{
                            padding: "12px 8px",
                            textAlign: "left",
                            color: "#40e0d0",
                            fontWeight: "600",
                            fontSize: "0.9em",
                          }}
                        >
                          Тикер
                        </th>
                        <th
                          style={{
                            padding: "12px 8px",
                            textAlign: "center",
                            color: "#40e0d0",
                            fontWeight: "600",
                            fontSize: "0.9em",
                          }}
                        >
                          Сторона
                        </th>
                        <th
                          style={{
                            padding: "12px 8px",
                            textAlign: "left",
                            color: "#40e0d0",
                            fontWeight: "600",
                            fontSize: "0.9em",
                          }}
                        >
                          Причины входа
                        </th>
                        <th
                          style={{
                            padding: "12px 8px",
                            textAlign: "right",
                            color: "#40e0d0",
                            fontWeight: "600",
                            fontSize: "0.9em",
                          }}
                        >
                          Результат
                        </th>
                        <th
                          style={{
                            padding: "12px 8px",
                            textAlign: "right",
                            color: "#40e0d0",
                            fontWeight: "600",
                            fontSize: "0.9em",
                          }}
                        >
                          Комиссия
                        </th>
                        <th
                          style={{
                            padding: "12px 8px",
                            textAlign: "center",
                            color: "#40e0d0",
                            fontWeight: "600",
                            fontSize: "0.9em",
                          }}
                        >
                          Система
                        </th>
                        <th
                          style={{
                            padding: "12px 8px",
                            textAlign: "center",
                            color: "#40e0d0",
                            fontWeight: "600",
                            fontSize: "0.9em",
                          }}
                        >
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {trades.map((item) => (
                        <tr
                          key={item.id}
                          style={{
                            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                            transition: "background-color 0.2s ease",
                          }}
                        >
                          <td
                            style={{
                              padding: "16px 8px",
                              fontSize: "0.85em",
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            <div>{formatDate(item.date)}</div>
                            <div>{item.time}</div>
                          </td>
                          <td
                            style={{ padding: "16px 8px", fontWeight: "600" }}
                          >
                            {item.type === "deposit_operation" ? (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  fontSize: "0.8em",
                                  fontWeight: "600",
                                  background:
                                    item.operationType === "deposit"
                                      ? "rgba(0, 255, 136, 0.2)"
                                      : "rgba(255, 107, 107, 0.2)",
                                  color:
                                    item.operationType === "deposit"
                                      ? "#00ff88"
                                      : "#ff6b6b",
                                }}
                              >
                                <DollarSign size={12} />
                                {item.operationType === "deposit"
                                  ? "Пополнение"
                                  : "Вывод"}
                              </span>
                            ) : (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  fontSize: "0.8em",
                                  fontWeight: "600",
                                  background: "rgba(64, 224, 208, 0.2)",
                                  color: "#40e0d0",
                                }}
                              >
                                <TrendingUp size={12} />
                                Сделка
                              </span>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "16px 8px",
                              fontWeight: "600",
                              color: "#ffffff",
                            }}
                          >
                            {item.type === "trade" ? item.ticker : "-"}
                          </td>
                          <td
                            style={{ padding: "16px 8px", textAlign: "center" }}
                          >
                            {item.type === "trade" ? (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  fontSize: "0.8em",
                                  fontWeight: "600",
                                  background:
                                    item.side === "Long"
                                      ? "rgba(0, 255, 136, 0.2)"
                                      : "rgba(255, 107, 107, 0.2)",
                                  color:
                                    item.side === "Long"
                                      ? "#00ff88"
                                      : "#ff6b6b",
                                }}
                              >
                                {item.side === "Long" ? (
                                  <TrendingUp size={12} />
                                ) : (
                                  <TrendingDown size={12} />
                                )}
                                {item.side}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td
                            style={{
                              padding: "16px 8px",
                              fontSize: "0.9em",
                              maxWidth: "200px",
                              wordWrap: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            <div
                              style={{
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                                color: "rgba(255, 255, 255, 0.8)",
                                marginBottom: "4px",
                              }}
                            >
                              {item.type === "trade"
                                ? item.entryReasons
                                : item.comment}
                            </div>
                            {item.type === "trade" && item.comment && (
                              <div
                                style={{
                                  fontSize: "0.8em",
                                  color: "rgba(255, 255, 255, 0.5)",
                                  fontStyle: "italic",
                                  wordWrap: "break-word",
                                  whiteSpace: "normal",
                                  borderTop:
                                    "1px solid rgba(255, 255, 255, 0.1)",
                                  paddingTop: "8px",
                                  marginTop: "8px",
                                }}
                              >
                                {item.comment}
                              </div>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "16px 8px",
                              textAlign: "right",
                              fontWeight: "600",
                              color:
                                item.type === "trade"
                                  ? item.result >= 0
                                    ? "#00ff88"
                                    : "#ff6b6b"
                                  : item.amount >= 0
                                  ? "#00ff88"
                                  : "#ff6b6b",
                            }}
                          >
                            {item.type === "trade"
                              ? `${
                                  item.result >= 0 ? "+" : ""
                                }${item.result.toFixed(2)}`
                              : `${item.amount >= 0 ? "+" : "-"}${Math.abs(
                                  item.amount
                                ).toFixed(2)}`}
                          </td>
                          <td
                            style={{
                              padding: "16px 8px",
                              textAlign: "right",
                              color: "#ff6b6b",
                            }}
                          >
                            {item.type === "trade"
                              ? `${item.commission.toFixed(2)}`
                              : "-"}
                          </td>
                          <td
                            style={{ padding: "16px 8px", textAlign: "center" }}
                          >
                            {item.type === "trade" ? (
                              <span
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  fontSize: "0.8em",
                                  fontWeight: "600",
                                  background:
                                    item.isSystematic === "Да"
                                      ? "rgba(255, 215, 0, 0.2)"
                                      : "rgba(255, 255, 255, 0.1)",
                                  color:
                                    item.isSystematic === "Да"
                                      ? "#FFD700"
                                      : "rgba(255, 255, 255, 0.7)",
                                }}
                              >
                                {item.isSystematic}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td
                            style={{ padding: "16px 8px", textAlign: "center" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                justifyContent: "center",
                              }}
                            >
                              {item.type === "trade" && (
                                <button
                                  onClick={() => {
                                    // Заполняем форму данными сделки для редактирования
                                    setNewTrade({
                                      ticker: item.ticker,
                                      side: item.side,
                                      entryReasons: item.entryReasons,
                                      result: item.result.toString(),
                                      commission: item.commission.toString(),
                                      comment: item.comment || "",
                                      isSystematic: item.isSystematic,
                                    });
                                    // Удаляем старую запись
                                    deleteTrade(item.id);
                                    // Показываем форму
                                    setShowNewTradeForm(true);
                                  }}
                                  style={{
                                    background: "rgba(64, 224, 208, 0.2)",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "8px",
                                    color: "#40e0d0",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                  }}
                                  onMouseOver={(e) => {
                                    e.target.style.background =
                                      "rgba(64, 224, 208, 0.3)";
                                  }}
                                  onMouseOut={(e) => {
                                    e.target.style.background =
                                      "rgba(64, 224, 208, 0.2)";
                                  }}
                                >
                                  <Edit3 size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => deleteTrade(item.id)}
                                style={{
                                  background: "rgba(255, 107, 107, 0.2)",
                                  border: "none",
                                  borderRadius: "8px",
                                  padding: "8px",
                                  color: "#ff6b6b",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.background =
                                    "rgba(255, 107, 107, 0.3)";
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.background =
                                    "rgba(255, 107, 107, 0.2)";
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {currentTab === "achievements" && (
          <div style={{ gridColumn: "1 / -1", padding: "0 20px" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <button
                onClick={() =>
                  setShowNewAchievementForm(!showNewAchievementForm)
                }
                style={{
                  background: "linear-gradient(135deg, #40e0d0, #48d1cc)",
                  color: "#000000",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  fontSize: "1em",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Plus size={20} />
                Создать достижение
              </button>
            </div>

            {/* Add Achievement Form */}
            {showNewAchievementForm && (
              <div
                style={{
                  ...styles.card,
                  marginBottom: "32px",
                  maxWidth: "600px",
                  margin: "0 auto 32px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.3em",
                    fontWeight: "700",
                    marginBottom: "24px",
                    color: "#40e0d0",
                  }}
                >
                  Создать новое достижение
                </h3>

                {/* Category Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    Категория
                  </label>
                  <select
                    value={newAchievement.category}
                    onChange={(e) =>
                      setNewAchievement((prev) => ({
                        ...prev,
                        category: e.target.value,
                        value: 0,
                      }))
                    }
                    style={{
                      width: "100%",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      padding: "12px",
                      color: "#ffffff",
                      fontSize: "1em",
                    }}
                  >
                    {Object.entries(achievementCategories).map(
                      ([key, category]) => (
                        <option
                          key={key}
                          value={key}
                          style={{ background: "#1a1a1a", color: "#ffffff" }}
                        >
                          {category.icon} {category.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Dynamic Fields Based on Category */}
                {newAchievement.category === "levelUp" && (
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      Целевой ранг
                    </label>
                    <select
                      value={newAchievement.value}
                      onChange={(e) =>
                        setNewAchievement((prev) => ({
                          ...prev,
                          value: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        padding: "12px",
                        color: "#ffffff",
                        fontSize: "1em",
                      }}
                    >
                      <option value="" style={{ background: "#1a1a1a" }}>
                        Выберите ранг
                      </option>
                      {ranks.map((rank) => (
                        <option
                          key={rank.name}
                          value={rank.name}
                          style={{ background: "#1a1a1a", color: "#ffffff" }}
                        >
                          {rank.name} (${rank.min.toLocaleString()} - $
                          {rank.max.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(newAchievement.category === "tradeProfit" ||
                  newAchievement.category === "dailyProfit") && (
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      Целевая сумма ($)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newAchievement.value}
                      onChange={(e) =>
                        setNewAchievement((prev) => ({
                          ...prev,
                          value: parseFloat(e.target.value) || 0,
                        }))
                      }
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        padding: "12px",
                        color: "#ffffff",
                        fontSize: "1em",
                      }}
                    />
                  </div>
                )}

                {newAchievement.category === "discipline" && (
                  <>
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "600",
                          color: "rgba(255, 255, 255, 0.8)",
                        }}
                      >
                        Событие дисциплины
                      </label>
                      <input
                        type="text"
                        placeholder="Описание события"
                        value={newAchievement.event}
                        onChange={(e) =>
                          setNewAchievement((prev) => ({
                            ...prev,
                            event: e.target.value,
                          }))
                        }
                        style={{
                          width: "100%",
                          background: "rgba(255, 255, 255, 0.1)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "8px",
                          padding: "12px",
                          color: "#ffffff",
                          fontSize: "1em",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                        marginBottom: "16px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "600",
                            color: "rgba(255, 255, 255, 0.8)",
                          }}
                        >
                          Количество
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={newAchievement.value}
                          onChange={(e) =>
                            setNewAchievement((prev) => ({
                              ...prev,
                              value: parseFloat(e.target.value) || 0,
                            }))
                          }
                          style={{
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "8px",
                            padding: "12px",
                            color: "#ffffff",
                            fontSize: "1em",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "600",
                            color: "rgba(255, 255, 255, 0.8)",
                          }}
                        >
                          Период
                        </label>
                        <select
                          value={newAchievement.period}
                          onChange={(e) =>
                            setNewAchievement((prev) => ({
                              ...prev,
                              period: e.target.value,
                            }))
                          }
                          style={{
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "8px",
                            padding: "12px",
                            color: "#ffffff",
                            fontSize: "1em",
                          }}
                        >
                          <option
                            value="days"
                            style={{ background: "#1a1a1a" }}
                          >
                            Дней
                          </option>
                          <option
                            value="weeks"
                            style={{ background: "#1a1a1a" }}
                          >
                            Недель
                          </option>
                          <option
                            value="months"
                            style={{ background: "#1a1a1a" }}
                          >
                            Месяцев
                          </option>
                          <option
                            value="years"
                            style={{ background: "#1a1a1a" }}
                          >
                            Лет
                          </option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {newAchievement.category === "stability" && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "600",
                          color: "rgba(255, 255, 255, 0.8)",
                        }}
                      >
                        Количество
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={newAchievement.value}
                        onChange={(e) =>
                          setNewAchievement((prev) => ({
                            ...prev,
                            value: parseFloat(e.target.value) || 0,
                          }))
                        }
                        style={{
                          width: "100%",
                          background: "rgba(255, 255, 255, 0.1)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "8px",
                          padding: "12px",
                          color: "#ffffff",
                          fontSize: "1em",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "600",
                          color: "rgba(255, 255, 255, 0.8)",
                        }}
                      >
                        Период
                      </label>
                      <select
                        value={newAchievement.period}
                        onChange={(e) =>
                          setNewAchievement((prev) => ({
                            ...prev,
                            period: e.target.value,
                          }))
                        }
                        style={{
                          width: "100%",
                          background: "rgba(255, 255, 255, 0.1)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "8px",
                          padding: "12px",
                          color: "#ffffff",
                          fontSize: "1em",
                        }}
                      >
                        <option value="days" style={{ background: "#1a1a1a" }}>
                          Дней
                        </option>
                        <option value="weeks" style={{ background: "#1a1a1a" }}>
                          Недель
                        </option>
                        <option
                          value="months"
                          style={{ background: "#1a1a1a" }}
                        >
                          Месяцев
                        </option>
                        <option value="years" style={{ background: "#1a1a1a" }}>
                          Лет
                        </option>
                      </select>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={addNewAchievement}
                    style={{
                      flex: 1,
                      background: "linear-gradient(135deg, #6a5acd, #9370db)",
                      color: "#ffffff",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontSize: "1em",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Создать достижение
                  </button>
                  <button
                    onClick={() => setShowNewAchievementForm(false)}
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontSize: "1em",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {/* Achievements by Categories */}
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              {achievements.length === 0 ? (
                <div
                  style={{
                    ...styles.card,
                    textAlign: "center",
                    padding: "60px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.5em",
                      color: "rgba(255, 255, 255, 0.5)",
                      marginBottom: "16px",
                    }}
                  >
                    Пока нет достижений
                  </h3>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontSize: "1em",
                    }}
                  >
                    Создайте свое первое достижение, чтобы начать отслеживать
                    прогресс
                  </p>
                </div>
              ) : (
                Object.entries(groupedAchievements).map(
                  ([categoryKey, categoryAchievements]) => {
                    const category = achievementCategories[categoryKey];
                    const currentAchievement =
                      getCurrentAchievementInCategory(categoryAchievements);
                    const completedCount = categoryAchievements.filter(
                      (a) => a.completed
                    ).length;
                    const progress = getCategoryProgress(categoryAchievements);

                    return (
                      <div
                        key={categoryKey}
                        style={{ ...styles.card, marginBottom: "24px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "20px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "16px",
                            }}
                          >
                            <div
                              style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "12px",
                                background:
                                  progress === 100
                                    ? "linear-gradient(135deg, #00ff88, #00cc70)"
                                    : "linear-gradient(135deg, #6a5acd, #9370db)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2em",
                              }}
                            >
                              {category.icon}
                            </div>
                            <div>
                              <h3
                                style={{
                                  fontWeight: "700",
                                  fontSize: "1.4em",
                                  marginBottom: "4px",
                                  color:
                                    progress === 100 ? "#00ff88" : "#ffffff",
                                }}
                              >
                                {category.name}
                              </h3>
                              <p
                                style={{
                                  color: "rgba(255, 255, 255, 0.7)",
                                  fontSize: "0.9em",
                                  margin: 0,
                                }}
                              >
                                {category.description}
                              </p>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div
                              style={{
                                fontSize: "1.5em",
                                fontWeight: "700",
                                color: "#40e0d0",
                              }}
                            >
                              {completedCount}/{categoryAchievements.length}
                            </div>
                            <div style={{ fontSize: "0.9em", opacity: 0.7 }}>
                              {Math.round(progress)}% завершено
                            </div>
                          </div>
                        </div>

                        {/* Current Achievement Progress */}
                        <div
                          style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "12px",
                            padding: "20px",
                            marginBottom: "16px",
                          }}
                        >
                          <div style={{ marginBottom: "12px" }}>
                            <div
                              style={{ fontWeight: "600", marginBottom: "4px" }}
                            >
                              Текущая цель:{" "}
                              {getAchievementDescription(currentAchievement)}
                            </div>
                            <div style={{ fontSize: "0.9em", opacity: 0.7 }}>
                              Прогресс: {currentAchievement.current} /{" "}
                              {currentAchievement.value}
                            </div>
                          </div>
                          <div
                            style={{
                              width: "100%",
                              height: "8px",
                              background: "rgba(255, 255, 255, 0.1)",
                              borderRadius: "4px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${Math.min(
                                  (currentAchievement.current /
                                    currentAchievement.value) *
                                    100,
                                  100
                                )}%`,
                                background: currentAchievement.completed
                                  ? "linear-gradient(90deg, #00ff88, #00cc70)"
                                  : "linear-gradient(90deg, #40e0d0, #48d1cc)",
                                borderRadius: "4px",
                                transition: "width 0.3s ease",
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* All Achievements in Category */}
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                          }}
                        >
                          {categoryAchievements.map((achievement, index) => (
                            <div
                              key={achievement.id}
                              style={{
                                background: achievement.completed
                                  ? "linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 255, 136, 0.1))"
                                  : achievement === currentAchievement
                                  ? "linear-gradient(135deg, rgba(64, 224, 208, 0.2), rgba(64, 224, 208, 0.1))"
                                  : "rgba(255, 255, 255, 0.05)",
                                border: achievement.completed
                                  ? "1px solid #00ff88"
                                  : achievement === currentAchievement
                                  ? "1px solid #40e0d0"
                                  : "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "8px",
                                padding: "12px 16px",
                                position: "relative",
                                minWidth: "120px",
                                textAlign: "center",
                              }}
                            >
                              <button
                                onClick={() =>
                                  deleteAchievement(achievement.id)
                                }
                                style={{
                                  position: "absolute",
                                  top: "4px",
                                  right: "4px",
                                  background: "rgba(255, 107, 107, 0.2)",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "4px",
                                  color: "#ff6b6b",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                              <div
                                style={{
                                  fontWeight: "600",
                                  fontSize: "0.9em",
                                  color: achievement.completed
                                    ? "#00ff88"
                                    : "#ffffff",
                                  marginBottom: "4px",
                                }}
                              >
                                {achievement.category === "levelUp"
                                  ? `Ранг ${achievement.value}`
                                  : achievement.category === "discipline"
                                  ? achievement.event
                                  : achievement.category === "stability"
                                  ? `${achievement.value} ${achievement.period}`
                                  : `${achievement.value}`}
                              </div>
                              {achievement.completed && (
                                <div
                                  style={{
                                    color: "#00ff88",
                                    fontSize: "0.8em",
                                  }}
                                >
                                  ✓ Завершено
                                </div>
                              )}
                              {achievement === currentAchievement &&
                                !achievement.completed && (
                                  <div
                                    style={{
                                      color: "#40e0d0",
                                      fontSize: "0.8em",
                                    }}
                                  >
                                    Текущая цель
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {currentTab === "tasks" && (
          <div style={{ gridColumn: "1 / -1", padding: "0 20px" }}>
            {/* Calendar and Date Navigation */}
            <div
              style={{
                ...styles.card,
                marginBottom: "32px",
                maxWidth: "800px",
                margin: "0 auto 32px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.3em",
                    fontWeight: "700",
                    color: "#40e0d0",
                    margin: 0,
                  }}
                >
                  📅 Календарь задач
                </h3>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  style={{
                    background: "linear-gradient(135deg, #40e0d0, #48d1cc)",
                    color: "#000000",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "0.9em",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {showCalendar ? "Скрыть календарь" : "Показать календарь"}
                </button>
              </div>

              {/* Current selected date */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div
                  style={{
                    fontSize: "1.2em",
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  {selectedDate === new Date().toISOString().split("T")[0]
                    ? `Сегодня - ${new Date(selectedDate).toLocaleDateString(
                        "ru-RU"
                      )}`
                    : new Date(selectedDate).toLocaleDateString("ru-RU")}
                </div>
                <div
                  style={{
                    fontSize: "0.9em",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {selectedDate === new Date().toISOString().split("T")[0]
                    ? "Текущие задачи"
                    : "История задач"}
                </div>
              </div>

              {/* Simple calendar */}
              {showCalendar && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "4px",
                    marginBottom: "20px",
                    padding: "16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "12px",
                  }}
                >
                  {/* Calendar days */}
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
                    <div
                      key={day}
                      style={{
                        textAlign: "center",
                        padding: "8px",
                        fontSize: "0.8em",
                        color: "rgba(255, 255, 255, 0.7)",
                        fontWeight: "600",
                      }}
                    >
                      {day}
                    </div>
                  ))}

                  {/* Generate last 14 days */}
                  {(() => {
                    const dates = [];
                    for (let i = 13; i >= 0; i--) {
                      const date = new Date();
                      date.setDate(date.getDate() - i);
                      const dateStr = date.toISOString().split("T")[0];
                      const today = new Date().toISOString().split("T")[0];
                      const hasHistory =
                        taskHistory[dateStr] && taskHistory[dateStr].length > 0;
                      const hasTasks =
                        dateStr === today && dailyTasks.length > 0;

                      dates.push(
                        <button
                          key={dateStr}
                          onClick={() => setSelectedDate(dateStr)}
                          style={{
                            padding: "8px 4px",
                            borderRadius: "6px",
                            border:
                              selectedDate === dateStr
                                ? "2px solid #40e0d0"
                                : "1px solid rgba(255, 255, 255, 0.1)",
                            background:
                              selectedDate === dateStr
                                ? "rgba(64, 224, 208, 0.2)"
                                : hasHistory || hasTasks
                                ? "rgba(255, 215, 0, 0.1)"
                                : "rgba(255, 255, 255, 0.05)",
                            color:
                              selectedDate === dateStr ? "#40e0d0" : "#ffffff",
                            cursor: "pointer",
                            fontSize: "0.8em",
                            fontWeight:
                              selectedDate === dateStr ? "600" : "400",
                            position: "relative",
                          }}
                        >
                          {date.getDate()}
                          {(hasHistory || hasTasks) && (
                            <div
                              style={{
                                position: "absolute",
                                top: "2px",
                                right: "2px",
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "#FFD700",
                              }}
                            />
                          )}
                        </button>
                      );
                    }
                    return dates;
                  })()}
                </div>
              )}

              {/* Quick date navigation */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {[0, 1, 2, 3, 7].map((daysAgo) => {
                  const date = new Date();
                  date.setDate(date.getDate() - daysAgo);
                  const dateStr = date.toISOString().split("T")[0];
                  const label =
                    daysAgo === 0
                      ? "Сегодня"
                      : daysAgo === 1
                      ? "Вчера"
                      : daysAgo === 2
                      ? "Позавчера"
                      : daysAgo === 7
                      ? "Неделю назад"
                      : `${daysAgo} дней назад`;

                  return (
                    <button
                      key={daysAgo}
                      onClick={() => setSelectedDate(dateStr)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border:
                          selectedDate === dateStr
                            ? "2px solid #40e0d0"
                            : "1px solid rgba(255, 255, 255, 0.2)",
                        background:
                          selectedDate === dateStr
                            ? "rgba(64, 224, 208, 0.2)"
                            : "rgba(255, 255, 255, 0.05)",
                        color:
                          selectedDate === dateStr
                            ? "#40e0d0"
                            : "rgba(255, 255, 255, 0.8)",
                        cursor: "pointer",
                        fontSize: "0.9em",
                        fontWeight: selectedDate === dateStr ? "600" : "400",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Task Section - только для сегодняшнего дня */}
            {selectedDate === new Date().toISOString().split("T")[0] && (
              <div
                style={{
                  ...styles.card,
                  marginBottom: "32px",
                  maxWidth: "600px",
                  margin: "0 auto 32px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.3em",
                    fontWeight: "700",
                    marginBottom: "24px",
                    color: "#40e0d0",
                  }}
                >
                  Управление ежедневными задачами
                </h3>
                <div style={{ display: "flex", gap: "16px" }}>
                  <input
                    type="text"
                    placeholder="Новая задача..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addNewTask()}
                    style={{
                      flex: 1,
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      padding: "12px",
                      color: "#ffffff",
                      fontSize: "1em",
                    }}
                  />
                  <button
                    onClick={addNewTask}
                    style={{
                      background: "linear-gradient(135deg, #40e0d0, #48d1cc)",
                      color: "#000000",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontSize: "1em",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Plus size={20} />
                    Добавить
                  </button>
                </div>
              </div>
            )}

            {/* Tasks List */}
            <div
              style={{
                ...styles.card,
                maxWidth: "800px",
                margin: "0 auto 32px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.3em",
                  fontWeight: "700",
                  marginBottom: "24px",
                  color: "#40e0d0",
                }}
              >
                {selectedDate === new Date().toISOString().split("T")[0]
                  ? "Ежедневные задачи"
                  : `История задач - ${new Date(
                      selectedDate
                    ).toLocaleDateString("ru-RU")}`}
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {(() => {
                  const today = new Date().toISOString().split("T")[0];
                  const tasksToShow =
                    selectedDate === today
                      ? dailyTasks
                      : taskHistory[selectedDate] || [];

                  if (tasksToShow.length === 0) {
                    return (
                      <p
                        style={{
                          textAlign: "center",
                          color: "rgba(255, 255, 255, 0.5)",
                          padding: "32px",
                        }}
                      >
                        {selectedDate === today
                          ? "Нет задач на сегодня"
                          : "Нет задач на эту дату"}
                      </p>
                    );
                  }

                  return tasksToShow.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "12px",
                        padding: "16px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <button
                          onClick={() => toggleTask(task.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: task.completed
                              ? "#00ff88"
                              : "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          {task.completed ? (
                            <CheckSquare size={20} />
                          ) : (
                            <Square size={20} />
                          )}
                        </button>
                        <div>
                          <div
                            style={{
                              color: task.completed
                                ? "rgba(255, 255, 255, 0.5)"
                                : "#ffffff",
                              textDecoration: task.completed
                                ? "line-through"
                                : "none",
                              fontWeight: "600",
                            }}
                          >
                            {task.name}
                          </div>
                          <div
                            style={{
                              fontSize: "0.85em",
                              color: task.completed
                                ? "#00ff88"
                                : "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            {task.completed
                              ? "Выполнено ✓"
                              : `${task.current} / ${task.target}`}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        style={{
                          background: "rgba(255, 107, 107, 0.2)",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px",
                          color: "#ff6b6b",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Task Statistics */}
            <div
              style={{ ...styles.card, maxWidth: "600px", margin: "0 auto" }}
            >
              <h3
                style={{
                  fontSize: "1.3em",
                  fontWeight: "700",
                  marginBottom: "24px",
                  color: "#40e0d0",
                }}
              >
                Статистика задач
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "20px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2.4em",
                      fontWeight: "700",
                      color: "#40e0d0",
                      marginBottom: "8px",
                    }}
                  >
                    {(() => {
                      const today = new Date().toISOString().split("T")[0];
                      const tasksToShow =
                        selectedDate === today
                          ? dailyTasks
                          : taskHistory[selectedDate] || [];
                      return tasksToShow.length;
                    })()}
                  </div>
                  <div
                    style={{
                      fontSize: "0.9em",
                      opacity: 0.7,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Всего задач
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2.4em",
                      fontWeight: "700",
                      color: "#FFD700",
                      marginBottom: "8px",
                    }}
                  >
                    {(() => {
                      const today = new Date().toISOString().split("T")[0];
                      const tasksToShow =
                        selectedDate === today
                          ? dailyTasks
                          : taskHistory[selectedDate] || [];

                      if (tasksToShow.length === 0) return 0;

                      return Math.round(
                        (tasksToShow.filter((t) => t.completed).length /
                          tasksToShow.length) *
                          100
                      );
                    })()}
                    %
                  </div>
                  <div
                    style={{
                      fontSize: "0.9em",
                      opacity: 0.7,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Прогресс
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {currentTab === "settings" && (
          <div style={{ gridColumn: "1 / -1", padding: "0 20px" }}>
            {/* Profile Settings */}
            <div
              style={{
                ...styles.card,
                marginBottom: "32px",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.3em",
                    fontWeight: "700",
                    color: "#40e0d0",
                  }}
                >
                  Настройки профиля
                </h3>
                <button
                  onClick={() => {
                    setTempProfile(userProfile);
                    setIsEditingProfile(!isEditingProfile);
                  }}
                  style={{
                    background: "rgba(64, 224, 208, 0.2)",
                    border: "1px solid #40e0d0",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    color: "#40e0d0",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Edit3 size={16} />
                  {isEditingProfile ? "Отмена" : "Редактировать"}
                </button>
              </div>

              {isEditingProfile ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      Никнейм
                    </label>
                    <input
                      type="text"
                      placeholder="Ваш никнейм"
                      value={tempProfile.nickname}
                      onChange={(e) =>
                        setTempProfile((prev) => ({
                          ...prev,
                          nickname: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        padding: "12px",
                        color: "#ffffff",
                        fontSize: "1em",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "12px",
                        fontWeight: "600",
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      Выберите аватар
                    </label>

                    {/* Upload custom avatar */}
                    <div style={{ marginBottom: "16px" }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        style={{ display: "none" }}
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        style={{
                          display: "inline-block",
                          background:
                            "linear-gradient(135deg, #40e0d0, #48d1cc)",
                          color: "#000",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.9em",
                        }}
                      >
                        Загрузить свою картинку
                      </label>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "12px",
                      }}
                    >
                      {avatarOptions.map((avatar, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setTempProfile((prev) => ({ ...prev, avatar }));
                            setCustomAvatar(null);
                          }}
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "12px",
                            border:
                              tempProfile.avatar === avatar
                                ? "3px solid #40e0d0"
                                : "2px solid rgba(255, 255, 255, 0.2)",
                            background: "none",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            overflow: "hidden",
                            margin: "0 auto",
                          }}
                        >
                          <img
                            src={avatar}
                            alt={`Аватар ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "16px" }}>
                    <button
                      onClick={saveProfile}
                      style={{
                        flex: 1,
                        background: "linear-gradient(135deg, #40e0d0, #48d1cc)",
                        color: "#000000",
                        border: "none",
                        padding: "12px",
                        borderRadius: "8px",
                        fontSize: "1em",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={cancelProfileEdit}
                      style={{
                        flex: 1,
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "#ffffff",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        padding: "12px",
                        borderRadius: "8px",
                        fontSize: "1em",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  <img
                    src={userProfile.avatar}
                    alt="Текущий аватар"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "12px",
                      border: "3px solid #40e0d0",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: "1.5em",
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: "4px",
                      }}
                    >
                      {userProfile.nickname}
                    </div>
                    <div
                      style={{
                        fontSize: "1em",
                        fontWeight: "600",
                        color: "#40e0d0",
                      }}
                    >
                      Баланс: ${tradingData.deposit.toFixed(2)}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9em",
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Ранг: {currentRank.name}
                    </div>
                    {/* Кнопка очистки данных */}
                    <div
                      style={{
                        ...styles.card,
                        marginBottom: "32px",
                        maxWidth: "600px",
                        margin: "0 auto",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "1.3em",
                          fontWeight: "700",
                          marginBottom: "24px",
                          color: "#ff6b6b",
                        }}
                      >
                        Сброс данных
                      </h3>

                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Вы уверены? Все данные будут удалены безвозвратно!"
                            )
                          ) {
                            localStorage.clear();
                            window.location.reload();
                          }
                        }}
                        style={{
                          background:
                            "linear-gradient(135deg, #ff6b6b, #ff5252)",
                          color: "#ffffff",
                          border: "none",
                          padding: "12px 24px",
                          borderRadius: "8px",
                          fontSize: "1em",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Очистить все данные
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZeroToHeroApp;
