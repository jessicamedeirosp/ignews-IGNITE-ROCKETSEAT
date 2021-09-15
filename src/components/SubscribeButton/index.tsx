import { getStripeJs } from '../../services/stripe-js';
import { signIn, useSession } from 'next-auth/client';
import { api } from '../../services/api';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const [ session ] = useSession();
    async function handleSubcribe() {
        if(!session) {
            signIn('github');
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
