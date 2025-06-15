<?php

namespace App\Http\Requests;

use App\Exceptions\ResourceNotFoundException;
use App\Models\Provider;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProviderRequest extends FormRequest
{
    protected ?Provider $providerToUpdate = null;

    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation(): void
    {
        $id = $this->route('provider');

        $this->providerToUpdate = Provider::find($id);

        if (!$this->providerToUpdate) {
            throw new ResourceNotFoundException('Recurso no encontrado');
        }
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|string|'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The name is required',
            'name.string' => 'The name must be a string',
            'name.max' => 'Maximum 255 characters',
            'description.string' => 'The description must be a string'
        ];
    }
}
