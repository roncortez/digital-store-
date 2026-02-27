import { api } from "../../api/api"
import { useState } from "react"
import { FaFileUpload, FaSpinner } from "react-icons/fa"

export default function Import() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files?.[0]);
        setFile(e.target.files?.[0] || null);
        setMessage(null);
    };

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setMessage({ type: 'error', text: 'Selecciona un archivo primero' });
            return;
        }
        setLoading(true);
        setMessage(null);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await api.post('/products/import', formData);
            console.log(response.data);
            setMessage({ type: 'success', text: 'Productos importados exitosamente' });
            setFile(null);
        } catch (error) {
            console.error('Error importando productos:', error);
            setMessage({ type: 'error', text: 'Error al importar productos' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-brand-dark border border-gray-800 p-8 rounded-lg shadow-2xl max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaFileUpload className="w-8 h-8 text-brand-yellow" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Importar productos</h2>
                <p className="text-gray-400">Sube un archivo CSV o Excel para importar productos al inventario</p>
            </div>

            <form onSubmit={handleImport} className="space-y-6">
                {/* File Input Area */}
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-brand-yellow/50 transition-colors bg-gray-800/30">
                    <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center"
                    >
                        {file ? (
                            <>
                                <FaFileUpload className="w-12 h-12 text-brand-yellow mb-3" />
                                <p className="text-white font-medium">{file.name}</p>
                                <p className="text-gray-500 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                            </>
                        ) : (
                            <>
                                <FaFileUpload className="w-12 h-12 text-gray-500 mb-3" />
                                <p className="text-gray-300 font-medium">Arrastra un archivo o haz clic para seleccionar</p>
                                <p className="text-gray-500 text-sm mt-1">Formatos soportados: CSV, XLSX, XLS</p>
                            </>
                        )}
                    </label>
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-900/30 border border-green-700 text-green-400'
                        : 'bg-red-900/30 border border-red-700 text-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !file}
                    className={`w-full py-3 px-6 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${loading || !file
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-brand-yellow text-brand-dark hover:bg-yellow-400 hover:scale-[1.02]'
                        }`}
                >
                    {loading ? (
                        <>
                            <FaSpinner className="w-5 h-5 animate-spin" />
                            Importando...
                        </>
                    ) : (
                        <>
                            <FaFileUpload className="w-5 h-5" />
                            Importar Productos
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}