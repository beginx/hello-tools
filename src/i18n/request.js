import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const messages = (await import(`../messages/index.json`)).default;
  return {
    locale,
    messages: messages[locale] || messages.en
  };
});