type FieldConfig = {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

interface AuthFormProps {
title: string;
buttonText: string;
fields: FieldConfig[];
onSubmit: () => void;
footerText?: string;
footerLink?: string;
footerLinkText?: string;
}

export function AuthForm({ title, buttonText, fields, onSubmit, footerText, footerLink, footerLinkText }: AuthFormProps) {
    return (
        <>
            <h1 className="mb-8 text-center text-2xl font-bold text-white">{title}</h1>

            <form onSubmit={(e) => { e.preventDefault(); onSubmit() }} className="space-y-4">
                {fields.map(field => (
                    <div key={field.name}>
                        <label htmlFor={field.name} className="mb-1 block text-sm text-gray-400">
                            {field.label}
                        </label>
                        <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            value={field.value}
                            onChange={e => field.onChange(e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                            required
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700"
                >
                    {buttonText}
                </button>
            </form>

            {footerText && footerLink && footerLinkText && (
                <p className="mt-6 text-center text-sm text-gray-500">
                    {footerText}{' '}
                    <Link to={footerLink} className="text-primary-400 hover:text-primary-300">
                        {footerLinkText}
                    </Link>
                </p>
            )}
        </>
    )
}