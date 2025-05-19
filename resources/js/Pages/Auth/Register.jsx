import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user', // Default role is set to 'user'
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>

                 <div className="mt-4">
                    <InputLabel htmlFor="role" value="Register as" />

                    <div className="mt-2 flex justify-center space-x-6">
                        <button
                            type="button"
                            onClick={() => setData('role', 'user')}
                            className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition duration-200 ease-in-out ${
                                data.role === 'user'
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                            }`}
                            style={{ width: '160px', height: '160px' }}
                        >
                            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <span className="font-medium text-gray-900">User</span>
                            <span className="mt-1 text-xs text-gray-500">Regular passenger account</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setData('role', 'driver')}
                            className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition duration-200 ease-in-out ${
                                data.role === 'driver'
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                            }`}
                            style={{ width: '160px', height: '160px' }}
                        >
                            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            <span className="font-medium text-gray-900">Driver</span>
                            <span className="mt-1 text-xs text-gray-500">Provide transportation services</span>
                        </button>
                    </div>

                    <InputError message={errors.role} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}