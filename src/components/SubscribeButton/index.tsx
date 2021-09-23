import { getStripeJs } from '../../services/stripe-js';
import { signIn, useSession } from 'next-auth/client';
import { api } from '../../services/api';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';

interface SubscribeButtonProps {
    priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const [ session ] = useSession();
    const router = useRouter();

    async function handleSubcribe() {
        if (!session) {
            signIn('github');
            return;
        }

        if (session.activeSubscription) {
            router.push('/posts');
            return;
        }

        // criação da checkout session
        try {
            const response = await api.post('/subscribe');
            const { sessionId } = response.data;
            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({ sessionId });
        } catch(err) {
            alert(err.message);
        }
    }
    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubcribe}
        >
            Subscribe now
        </button>
    );
}
