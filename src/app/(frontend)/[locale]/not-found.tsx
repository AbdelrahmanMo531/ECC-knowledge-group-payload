import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { t } from '@/lib/i18n/server';

export default function NotFound() {
  return (
    <section className="bg-brand-beige py-24 lg:py-32">
      <Container size="narrow">
        <div className="text-center">
          <Logo lockup="mark" height={96} className="mx-auto" />

          <p className="mt-10 text-xs font-medium uppercase tracking-[0.18em] text-brand-turquoise">
            {t('error.404')}
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-brand-teal sm:text-4xl">
            {t('error.404.title')}
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-brand-ink/70">
            {t('error.404.body')}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button href="/">{t('error.home')}</Button>
            <Button href="/programs" variant="secondary">
              {t('error.programmes')}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
