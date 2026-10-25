<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('jabatans')->insert([
            'nama' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('jabatans')->insert([
            'nama' => 'manager',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('jabatans')->insert([
            'nama' => 'karyawan',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // jadwal
        DB::table('jadwals')->insert([
            'nama' => 'Jam Normal',
            'jam_masuk' => '07:30:00',
            'jam_pulang' => '15:30:00',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('jadwals')->insert([
            'nama' => 'Jam Lembur',
            'jam_masuk' => '07:30:00',
            'jam_pulang' => '21:00:00',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('jadwals')->insert([
            'nama' => 'Jam Khusus Jumat',
            'jam_masuk' => '08:00:00',
            'jam_pulang' => '13:00:00',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // status_jadwal
        DB::table('status_jadwals')->insert([
            'nama' => 'Hadir (WFO)',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('status_jadwals')->insert([
            'nama' => 'Hadir (WFH)',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('status_jadwals')->insert([
            'nama' => 'Izin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('status_jadwals')->insert([
            'nama' => 'Sakit',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->call([
            PenggunaSeeder::class,
        ]);
    }
}
