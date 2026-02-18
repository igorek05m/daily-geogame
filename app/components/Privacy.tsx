import { Modal } from './Modal';
import { Props } from '@/app/types';

export const PrivacyModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
      <h3 className="text-white font-bold mb-1">1. Anonymous Data Collection</h3>
      <p>
        I do not collect any personal data (like names, emails, or exact locations). 
        However, <strong>I do save your game progress</strong> (guesses and stats) to a database so you can continue playing later.
      </p>

      <h3 className="text-white font-bold mb-1 mt-4">2. Cookies & Local Storage</h3>
      <p>
        To recognize you when you come back, the game creates a random, anonymous ID (Session ID) stored in your browser&apos;s cookies.
      </p>
      <ul className="list-disc list-inside mt-2 opacity-80 text-xs">
        <li><strong>geo_session:</strong> An anonymous ID used to sync your progress with the server.</li>
      </ul>

      <h3 className="text-white font-bold mb-1 mt-4">3. Analytics</h3>
      <p>
        I aggregate anonymous game results (e.g., &quot;50 people won today&quot;) to display global statistics. This data cannot be traced back to you personally.
      </p>

      <h3 className="text-white font-bold mb-1 mt-4">4. Contact</h3>
      <p>
        If you have any questions about this game, please contact me via my website: <a href="https://igiii.is-a.dev" target="_blank" className="text-green-400 hover:underline">igiii.is-a.dev</a>.
      </p>
    </Modal>
  );
};