<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Ignacio',
            'email' => 'ignacio.garcia@iglusshop.com',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        User::create([
            'name' => 'Lucia',
            'email' => 'lucia.sanchez@iglusshop.com',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);
        User::create([
            'name' => 'user_prueba',
            'email' => 'user_prueba@iglusshop.com',
            'password' => Hash::make('password'),
            'role' => 'user'
        ]);
        User::factory(8)->create();
    }
}
