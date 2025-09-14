// Notification service for handling form submissions
import { supabase } from './supabase';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}

interface HeroFormData {
  name: string;
  email: string;
  phone: string;
}

interface RequestFormData {
  name: string;
  email: string;
  phone: string;
  preferences: string;
}

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_GROUP_CHAT_ID = process.env.TELEGRAM_GROUP_CHAT_ID;
const TELEGRAM_PERSONAL_CHAT_ID = process.env.TELEGRAM_PERSONAL_CHAT_ID;

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_lrco09n';
const EMAILJS_ADMIN_TEMPLATE_ID = 'template_kom3k4b';
const EMAILJS_USER_TEMPLATE_ID = 'template_hauqg1e';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Send notification to Telegram
export const sendTelegramNotification = async (message: string, chatId: string): Promise<boolean> => {
  if (!TELEGRAM_BOT_TOKEN || !chatId) {
    console.error('Telegram credentials are not configured or chat ID is missing');
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error('Telegram API responded with an error:', response.status, response.statusText);
      return false;
    }

    return response.ok;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return false;
  }
};

// Send email notification using EmailJS
export const sendEmailNotification = async (templateParams: any, templateId: string = EMAILJS_ADMIN_TEMPLATE_ID): Promise<boolean> => {
  if (!EMAILJS_SERVICE_ID || !templateId || !EMAILJS_PUBLIC_KEY) {
    console.warn('EmailJS credentials not configured');
    return false;
  }

  try {
    const emailjs = await import('@emailjs/browser');
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    return response.status === 200;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
};

// Send booking notification
export const sendBookingNotification = async (bookingData: any): Promise<{ success: boolean; error?: string }> => {
  try {
    const telegramMessage = `
🏠 <b>Новая заявка на просмотр недвижимости</b>

👤 <b>Имя:</b> ${bookingData.user_name}
📧 <b>Email:</b> ${bookingData.user_email}
📱 <b>Телефон:</b> ${bookingData.user_phone}

🏡 <b>Выбранные объекты:</b>
${bookingData.apartments.map((apt: any) => `
• <b>${apt.name}</b>
  📅 Дата: ${apt.date}
  🕐 Время: ${apt.time}
  🌍 Язык: ${apt.language}
  👥 Количество: ${apt.guests} чел.
  🚗 Сопровождение: ${apt.accompaniment ? 'Да' : 'Нет'}
  ☕ Удобства: ${apt.amenities ? apt.amenities_details || 'Да' : 'Нет'}
  👶 Дети/Питомцы: ${apt.with_children_pet || 'Нет'}
  💬 Комментарий: ${apt.comment || 'Нет'}
`).join('\n')}

⏰ <b>Время заявки:</b> ${new Date().toLocaleString('ru-RU')}
    `.trim();

    const telegramGroup = await sendTelegramNotification(telegramMessage, TELEGRAM_GROUP_CHAT_ID!);
    const telegramPersonal = await sendTelegramNotification(telegramMessage, TELEGRAM_PERSONAL_CHAT_ID!);

    const adminEmailParams = {
      to_email: 'trusthome.ge@gmail.com',
      user_name: bookingData.user_name,
      user_email: bookingData.user_email,
      user_phone: bookingData.user_phone,
      apartments: bookingData.apartments,
      submission_time: new Date().toLocaleString('ru-RU'),
    };
    const adminEmail = await sendEmailNotification(adminEmailParams, EMAILJS_ADMIN_TEMPLATE_ID);

    const userEmailParams = {
      to_email: bookingData.user_email,
      user_name: bookingData.user_name,
      apartments: bookingData.apartments,
      submission_time: new Date().toLocaleString('ru-RU'),
    };
    const userEmail = await sendEmailNotification(userEmailParams, EMAILJS_USER_TEMPLATE_ID);

    return { success: true };
  } catch (error) {
    console.error('Error sending booking notification:', error);
    return { success: false, error: 'Произошла ошибка при отправке' };
  }
};

// Format contact form for Telegram
const formatContactFormForTelegram = (data: ContactFormData): string => {
  return `
🏠 <b>Новая заявка с сайта Trust Home</b>

👤 <b>Имя:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
📱 <b>Телефон:</b> ${data.phone}
📋 <b>Тема:</b> ${data.subject || 'Не указана'}

💬 <b>Сообщение:</b>
${data.message}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
  `.trim();
};

// Handle contact form submission
export const handleContactFormSubmission = async (data: ContactFormData): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        created_at: new Date().toISOString(),
      }]);

    if (dbError) {
      console.error('Database error:', dbError);
    }

    const telegramMessage = formatContactFormForTelegram(data);
    const telegramSent = await sendTelegramNotification(telegramMessage, TELEGRAM_GROUP_CHAT_ID!);
    const emailParams = {
      to_email: 'your-email@example.com',
      from_name: data.name,
      from_email: data.email,
      phone: data.phone,
      subject: data.subject || 'Новая заявка',
      message: data.message,
      submission_time: new Date().toLocaleString('ru-RU'),
    };
    const emailSent = await sendEmailNotification(emailParams, EMAILJS_ADMIN_TEMPLATE_ID);

    if (!telegramSent && !emailSent) {
      return { success: false, error: 'Не удалось отправить уведомления' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error handling contact form:', error);
    return { success: false, error: 'Произошла ошибка при отправке' };
  }
};

// Format hero form for Telegram
const formatHeroFormForTelegram = (data: HeroFormData): string => {
  return `
🌟 <b>Заявка с главной страницы</b>

👤 <b>Имя:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
📱 <b>Телефон:</b> ${data.phone}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
  `.trim();
};

// Handle hero form submission
export const handleHeroFormSubmission = async (data: HeroFormData): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error: dbError } = await supabase
      .from('hero_submissions')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        created_at: new Date().toISOString(),
      }]);

    if (dbError) {
      console.error('Database error:', dbError);
    }

    const telegramMessage = formatHeroFormForTelegram(data);
    const telegramSent = await sendTelegramNotification(telegramMessage, TELEGRAM_GROUP_CHAT_ID!);

    const emailParams = {
      to_email: 'your-email@example.com',
      from_name: data.name,
      from_email: data.email,
      phone: data.phone,
      subject: 'Заявка с главной страницы',
      message: 'Пользователь оставил контакты на главной странице',
      submission_time: new Date().toLocaleString('ru-RU'),
    };
    const emailSent = await sendEmailNotification(emailParams, EMAILJS_ADMIN_TEMPLATE_ID);

    return { success: true };
  } catch (error) {
    console.error('Error handling hero form:', error);
    return { success: false, error: 'Произошла ошибка при отправке' };
  }
};

// Format request form for Telegram
const formatRequestFormForTelegram = (data: RequestFormData): string => {
  return `
📝 <b>Заявка на подбор недвижимости</b>

👤 <b>Имя:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
📱 <b>Телефон:</b> ${data.phone}

🏠 <b>Предпочтения:</b>
${data.preferences}

💰 <b>Ценовой диапазон:</b> $${data.priceRange[0].toLocaleString()} - $${data.priceRange[1].toLocaleString()}

📅 <b>Предпочтительная дата:</b> ${data.bookingDate || 'Не указана'}
🕐 <b>Время:</b> ${data.bookingTime}
🌍 <b>Язык:</b> ${data.language}
👥 <b>Количество:</b> ${data.guests} чел.
🚗 <b>Сопровождение:</b> ${data.accompaniment ? 'Да' : 'Нет'}
☕ <b>Удобства:</b> ${data.amenities ? data.amenitiesDetails || 'Да' : 'Нет'}
👶 <b>Дети:</b> ${data.withChildren ? 'Да' : 'Нет'}
🐕 <b>Питомцы:</b> ${data.withPets ? 'Да' : 'Нет'}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
  `.trim();
};

// Handle request form submission
export const handleRequestFormSubmission = async (data: RequestFormData): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error: dbError } = await supabase
      .from('request_submissions')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferences: data.preferences,
        created_at: new Date().toISOString(),
      }]);

    if (dbError) {
      console.error('Database error:', dbError);
    }

    const telegramMessage = formatRequestFormForTelegram(data);
    const telegramSent = await sendTelegramNotification(telegramMessage, TELEGRAM_GROUP_CHAT_ID!);

    const emailParams = {
      to_email: 'your-email@example.com',
      from_name: data.name,
      from_email: data.email,
      phone: data.phone,
      subject: 'Заявка на подбор недвижимости',
      message: data.preferences,
      submission_time: new Date().toLocaleString('ru-RU'),
    };
    const emailSent = await sendEmailNotification(emailParams, EMAILJS_ADMIN_TEMPLATE_ID);

    return { success: true };
  } catch (error) {
    console.error('Error handling request form:', error);
    return { success: false, error: 'Произошла ошибка при отправке' };
  }
};
