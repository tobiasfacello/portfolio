//! React
import { useState } from 'react';

//* Components
import FloatingLabelInput from '../../../components/interior/FloatingLabel';
import InlineValidation from '../../../components/interior/InlineValidation';
import PasswordStrength from '../../../components/interior/PasswordStrength';
import OtpInput from '../../../components/interior/OtpInput';
import TagInput from '../../../components/interior/TagInput';
import ExpandingSearch from '../../../components/interior/ExpandingSearch';

//* Styled
import { StyledDemoStack, StyledDemoRow, StyledDemoButton } from '../styled';

export function FloatingLabelDemo() {
	return (
		<StyledDemoStack>
			<FloatingLabelInput label="Full name" hint="As it appears on your invoice" />
			<FloatingLabelInput
				label="Display handle"
				defaultValue="tobiasfacello"
				maxLength={24}
				hint="Already filled — the label starts raised instead of animating up."
			/>
		</StyledDemoStack>
	);
}

export function TagInputDemo() {
	return (
		<StyledDemoStack>
			<TagInput
				label="Topics"
				max={6}
				defaultValue={['design systems', 'motion']}
				hint="Enter adds · Backspace arms the last tag · try adding a duplicate"
			/>
		</StyledDemoStack>
	);
}

export function ExpandingSearchDemo() {
	const [query, setQuery] = useState('');

	return (
		<StyledDemoStack>
			<ExpandingSearch
				onChange={setQuery}
				resultCount={query ? query.length * 3 : 0}
				placeholder="Search components"
			/>
		</StyledDemoStack>
	);
}

export function PasswordStrengthDemo() {
	const [password, setPassword] = useState('');

	return (
		<StyledDemoStack>
			<FloatingLabelInput
				label="New password"
				type="password"
				value={password}
				onChange={(v) => setPassword(v)}
			/>
			<PasswordStrength value={password} />
			<StyledDemoRow>
				<StyledDemoButton onClick={() => setPassword('Password123!')}>
					Try a guessable one
				</StyledDemoButton>
				<StyledDemoButton onClick={() => setPassword('correct-horse-Battery9!')}>
					Try a strong one
				</StyledDemoButton>
			</StyledDemoRow>
		</StyledDemoStack>
	);
}

export function OtpInputDemo() {
	const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');

	return (
		<StyledDemoStack $w="auto">
			<OtpInput
				status={status}
				hint="Paste the whole code — it fills every box, not just this one."
				errorMessage="That code did not match."
				successMessage="Code accepted."
				onComplete={(value) => setStatus(value === '123456' ? 'success' : 'error')}
				onChange={() => setStatus('idle')}
			/>
		</StyledDemoStack>
	);
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function InlineValidationDemo() {
	const [email, setEmail] = useState('');

	return (
		<StyledDemoStack>
			<InlineValidation
				label="Work email"
				value={email}
				onChange={setEmail}
				placeholder="you@company.com"
				type="email"
				hint="Validation starts after the first blur, not on the first keystroke."
				reserveLines={2}
				validate={(v) => {
					if (!v) return 'An email address is required.';
					if (!EMAIL.test(v)) return 'That does not look like a complete email address.';
					return null;
				}}
			/>
		</StyledDemoStack>
	);
}
