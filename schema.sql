-- ایجاد دیتابیس در صورت عدم وجود و تنظیم کاراکتر ست
CREATE DATABASE IF NOT EXISTS shaily_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shaily_db;

-- حذف جداول قدیمی به ترتیب وابستگی برای جلوگیری از خطا
DROP TABLE IF EXISTS daily_gamification_logs;
DROP TABLE IF EXISTS daily_logs;
DROP TABLE IF EXISTS user_gamification;
DROP TABLE IF EXISTS user_products;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS routines;
DROP TABLE IF EXISTS users;

-- جدول کاربران با تمام فیلدهای پروفایل، نوع اشتراک و آواتار
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(11) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    age VARCHAR(20),
    job VARCHAR(255),
    gender VARCHAR(20),
    skinType VARCHAR(50),
    skinConcerns JSON,
    hairType VARCHAR(50),
    hairConcerns JSON,
    comedones VARCHAR(50),
    redPimples VARCHAR(50),
    fineLines VARCHAR(50),
    foreheadNose VARCHAR(50),
    sideNose VARCHAR(50),
    cheeks VARCHAR(50),
    subscription_plan VARCHAR(50) DEFAULT 'پایه',
    avatarUrl VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول روتین‌های روزانه کاربر
CREATE TABLE routines (
    userId VARCHAR(36) NOT NULL,
    tasks JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (userId),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- جدول قفسه مجازی برای محصولات کاربر
CREATE TABLE user_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    productName VARCHAR(255) NOT NULL,
    productType VARCHAR(100),
    brand VARCHAR(100),
    openedDate DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- جدول کلی آمار گیمیفیکیشن کاربر
CREATE TABLE user_gamification (
    userId VARCHAR(36) PRIMARY KEY,
    points INT DEFAULT 0,
    streak INT DEFAULT 0,
    lastCompletedDate DATE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- جدول گزارش‌های روزانه سبک زندگی کاربر
CREATE TABLE daily_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    logDate DATE NOT NULL,
    sleepHours INT,
    waterIntake INT,
    stressLevel INT,
    UNIQUE KEY (userId, logDate),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- جدول گزارش‌های روزانه امتیازات کسب شده برای نمودار هفتگی
CREATE TABLE daily_gamification_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    logDate DATE NOT NULL,
    pointsEarned INT DEFAULT 0,
    UNIQUE KEY (userId, logDate),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- جدول پست‌های وبلاگ
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    coverImageUrl VARCHAR(255),
    content TEXT,
    authorName VARCHAR(100),
    publishedAt DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ایجاد ایندکس برای بهبود عملکرد کوئری‌ها
CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_routines_user_id ON routines(userId);
CREATE INDEX idx_products_user_id ON user_products(userId);
CREATE INDEX idx_logs_user_date ON daily_logs(userId, logDate);
CREATE INDEX idx_gamification_logs_user_date ON daily_gamification_logs(userId, logDate);
CREATE INDEX idx_posts_slug ON posts(slug);

-- اضافه کردن پست‌های نمونه برای وبلاگ
INSERT INTO posts (title, slug, excerpt, coverImageUrl, content, authorName, publishedAt) VALUES
(
    '۵ راز داشتن پوستی درخشان در پاییز',
    '5-secrets-for-glowing-autumn-skin',
    'پاییز فصل زیبایی است، اما تغییرات آب و هوایی می‌تواند پوست شما را خشک و کدر کند. در این مقاله، ۵ نکته کلیدی برای حفظ درخشش پوستتان در این فصل را بررسی می‌کنیم.',
    'https://images.unsplash.com/photo-1571782684803-a1a3e7931c8e?q=80&w=2070&auto=format&fit=crop',
    '## مقدمه\n\nپاییز با رنگ‌های گرم و هوای خنک خود از راه می‌رسد. اما این تغییرات می‌تواند چالش‌هایی برای پوست ما ایجاد کند. در ادامه به بررسی راهکارهایی برای مقابله با این چالش‌ها می‌پردازیم.\n\n### ۱. آبرسانی عمیق\n\nبا کاهش رطوبت هوا، پوست شما به آبرسانی بیشتری نیاز دارد. استفاده از سرم‌های هیالورونیک اسید را فراموش نکنید.\n\n* نوشیدن آب کافی\n* استفاده از دستگاه بخور در منزل\n\n### ۲. لایه‌برداری ملایم\n\nسلول‌های مرده پوست را با یک لایه‌بردار ملایم حذف کنید تا محصولات دیگر بهتر جذب شوند.\n\n> **نکته مهم:** از لایه‌برداری بیش از حد خودداری کنید، زیرا باعث حساسیت پوست می‌شود.\n\n### ۳. تغذیه مناسب فصل\n\nاز میوه‌ها و سبزیجات پاییزی مانند کدو حلوایی و سیب که سرشار از آنتی‌اکسیدان هستند، استفاده کنید.',
    'شایلی',
    CURDATE()
),
(
    'ویتامین C: هرآنچه باید درباره این قهرمان پوست بدانید',
    'vitamin-c-the-skin-hero',
    'ویتامین C یکی از محبوب‌ترین ترکیبات در دنیای مراقبت از پوست است. اما آیا واقعاً می‌دانید این ماده شگفت‌انگیز چه کاری برای پوست شما انجام می‌دهد؟',
    'https://images.unsplash.com/photo-1620916566398-39f168a76e60?q=80&w=1974&auto=format&fit=crop',
    '## ویتامین C چیست؟\n\nویتامین C یک آنتی‌اکسیدان قوی است که به محافظت از پوست در برابر آسیب‌های محیطی مانند آلودگی هوا و اشعه UV کمک می‌کند. این ماده همچنین در تولید کلاژن، که برای حفظ سفتی و جوانی پوست ضروری است، نقش کلیدی دارد.\n\n### مزایای اصلی ویتامین C:\n\n* **روشن‌کننده پوست:** به کاهش لک‌های تیره و یکدست شدن رنگ پوست کمک می‌کند.\n* **ضد پیری:** با تحریک کلاژن‌سازی، به کاهش خطوط ریز و چروک‌ها کمک می‌کند.\n* **محافظت آنتی‌اکسیدانی:** از پوست در برابر رادیکال‌های آزاد محافظت می‌کند.\n\n### چگونه از آن استفاده کنیم؟\n\nبهترین زمان استفاده از سرم ویتامین C، در **روتین صبح**، قبل از مرطوب‌کننده و ضدآفتاب است.',
    'شایلی',
    CURDATE()
);