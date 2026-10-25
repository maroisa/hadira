<?php

namespace Database\Factories;

use App\Models\Pengguna;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<Pengguna>
 */
class PenggunaFactory extends Factory
{
    protected static ?string $password;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'telepon' => fake()->phoneNumber(),
            'password' => static::$password ??= Hash::make('user123'),
            'aktif' => fake()->boolean(75),
            'jabatan_id' => 3,
            'created_at' => fake()->dateTimeBetween('-1 year', 'now')->getTimestamp(),
        ];
    }

    public function jabatan(int $jabatan_id): static
    {
        return $this->state(fn (array $attributes) => [
            'jabatan_id' => $jabatan_id,
            'aktif' => true,
            'password' => static::$password ??= Hash::make($jabatan_id == 1 ? 'admin123' : 'bos123'),
        ]);
    }
}
